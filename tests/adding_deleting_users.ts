import { AuthSessionMissingError, createClient,  JwtPayload, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../databasetypes'
import assert from 'node:assert';

import path from 'node:path';
import fs from 'node:fs';

import {getSupabaseClient, createUser, signInAndGetToken, signOut, oathSignIn, deleteAccount, changePassword, verifyToken}from '../all_methods/auth.js';
import {changeUsername, changeFirstName, changeLastName, changeMiddleName, changePublicOrPrivate, changeBio, setProfilePic, deleteProfilePic} from '../all_methods/usersettings.js';
import {getHomePagePostsAndCategories, getProfilePicOf, getFollowedByThesePeople, getFollowsThesePeople, getAllPostsBy, getAllMessagesBetween, postMessage, deleteMessage, getTaggedPostsFrom, toggleCloseFrined, getAllCloseFriends, viewCalendarOf, createFollowRequest, acceptFollowerRequest, rejectOrRevokeFollowerRequest} from '../all_methods/users.js';
import {getMyCalendar, createTodo, createEvent, getKanban, deleteTodo, deleteEvent, getAllViewershipTags, getAllCategories, changeViewershipTagsOfTodo, changeViewershipTagsOfEvent, changeViewershipTagsOfCategories, inviteToEvent, acceptInviteToEvent, editTodo, editEvent} from '../all_methods/myCalendar.js';
import {compileNorfications} from '../all_methods/notifications.js';
import {createGroup, deleteGroup, getGroupMembers, inviteMember, removeMember, acceptInvite, joinRequest, acceptJoinRequest, deleteJoinRequest, deleteInvite, changeGroupName, changeGroupDescription, changeGroupProfilePicture, deleteGroupProfilePicture, createGroupEvent, deleteGroupEvent, assignGroupTodo, deleteGroupTodo, messageGroup, getAllMessages, postGroupMessage, getGroupFullProfilePage,editGroupTodo, editGroupEvent, transferOwnership, changeRoleOf, leaveGroup, viewGroupCalendar, archiveGroup, unarchiveGroup} from '../all_methods/groups.js';
import {likePost, unlikePost, getAllLikedPosts, savePost, unSavePost, inspiredByPost, createPost, deletePost, archivePost, unarchivePost, changeVTs, changeCategories, getFeed, addCommentToPost, replyToComment} from '../all_methods/posts.js';

import { asyncTimer } from '../all_methods/utils.js'; 
import {createTestingUsers, deleteTestingUsers} from '../all_methods/test.js'

//This file tests modifiying user settings (permissions), different ways of signing in, and what happens when a user
//is deleted or added.

describe('users and user settings', function () {
    this.timeout(5000); // Set a timeout for the tests to run, as some operations may take longer
    /**
     * Testing strategy:
     * 
     * SECURITY
     * NOTIFICATIONS
     *
     * Changing password:
     *      partition on validity: valid, invalid
     *      partition on account: existing, non-existing, deleted
     * 
     * oathSignIn():
     *      partition on sign-in worked, sign-in didn't work
     * 
     * partition viewership after log-in:
     *      partition on login method: oauth, email
     *      partition on completed profile: first_name, last_name
     *      partition on attempting to remove first_name and last_name
     * 
     * profile picture:
     *      partition on default: set pp, did not set pp
     * 
     * change_email()
     *      partition on changed email, no changed email
     * 
     * change_username():
     *      partition on changed username, not changed username
     *      partition on valid username, not valid username
     * 
     * setting up user_page:
     *      partition on tab: tags, home page
     *      partition on categories: make sure it's in correct order, and only
     *                               the categories you want show up on your home page
     * 
     */
    it.skip('deleting all the users should work', async function () {
        const database: SupabaseClient<Database> = await getSupabaseClient();
        await deleteTestingUsers(database);
    });

    it.skip('Testing EMAIL sign up with and without an account', async function () {
        //setup
        const database: SupabaseClient<Database> = await getSupabaseClient();

        //checking invalid sign-in, passwords require 8 letters, lowercase/uppercase letters and digits
        assert.rejects(signInAndGetToken('a@a.com', 'Alphabet08', database), 'account doesn\'t exists');
        assert.rejects(createUser('a@a.com', 'a', database), 'no uppercase letters');
        assert.rejects(createUser('a@a.com', 'abcabc', database), 'too short of a password');
        assert.rejects(createUser('a@a.com', 'AbcdefghiJ', database), 'no digits in password');
        assert.rejects(createUser('a@a.com', 'ab83jd', database), 'too short of a password');
        assert.rejects(createUser('a@a.com', '*Alphabet', database), 'no digits in password');
        
        await assert.doesNotReject(createUser('a@a.com', 'Alphabet08', database), 'valid password should work');


        assert.rejects(createUser('a@a.com', 'Alphabet08', database), 'already created account should not work');

        let [token, refresh_token, user_id] = await signInAndGetToken('a@a.com', 'Alphabet08', database);
        signOut(token, database);

        await asyncTimer(100); // wait for a second to make sure the account is created
        assert.rejects(deleteAccount(database), 'deleting account without being signed in should not work');
        [token, refresh_token, user_id] = await signInAndGetToken('a@a.com', 'Alphabet08', database);

        await deleteAccount(database);
    });

    it.skip('creating all the users should work', async function () {
        const database: SupabaseClient<Database> = await getSupabaseClient();
        await createTestingUsers(database);
    });

    it.skip('changing passwords should work', async function () {
        const database: SupabaseClient<Database> = await getSupabaseClient();

        let [token, refresh_token, user_id] = await signInAndGetToken('a@a.com', 'Alphabet08', database);
        
        // Change password
        await assert.rejects(changePassword(database, 'acdefghijK'), 'password should be at least 8 characters long');
        await assert.doesNotReject(changePassword(database, 'Beta0893'), 'changing password should work');

        await signOut(token, database);
        await assert.rejects(signInAndGetToken('a@a.com', 'Alphabet08', database));
        [token, refresh_token, user_id] = await signInAndGetToken('a@a.com', 'Beta0893', database);
        await changePassword(database, 'Alphabet08'); // Change back to original password
        signOut(token, database);
    });

    it('oathSignIn should work', async function () {
        assert(false, 'oathSignIn is not implemented yet');
    });

    it.skip('changing user settings should work', async function () {
        const database: SupabaseClient<Database> = await getSupabaseClient();

        //can change first name, last name, middle name, bio,
        //public_or_private, and username

        //sign in with a user that has no first_name, last_name, or middle_name
        const info = (await signInAndGetToken('a@a.com', 'Alphabet08', database))
        await assert.doesNotReject(changeUsername('cool_username', info[2], database));


        //check that the username was created
        let response = await database.from('usersettings').select('username').match({id: info[2]});
        assert(response.data && response.data[0]?.username === 'cool_username', 'username should have been created');

        //check that we can change the username
        await assert.doesNotReject(changeUsername('cooler_username', info[2], database));
        response = await database.from('usersettings').select('username').match({id: info[2]});
        assert(response.data && response.data[0]?.username === 'cooler_username', 'username should have changed');

        //quick logging to make sure that the assertions are working
        if (response.data) {
            console.log('response', response.data[0]?.username);
        } else {
            console.log('response data is null');
        }
        
        //create a user with first_name, last_name, and middle_name
        await assert.doesNotReject(changeFirstName('Em', info[2], database));
        let response2 = await database.from('usersettings').select('first_name').match({id: info[2]});
        assert(response2.data && response2.data[0]?.first_name === 'Em', 'first name should have changed');

        await assert.doesNotReject(changeLastName('my', info[2], database));
        let response3 = await database.from('usersettings').select('last_name').match({id: info[2]});
        assert(response3.data && response3.data[0]?.last_name === 'my', 'last name should have changed');

        await assert.doesNotReject(changeMiddleName('R.', info[2], database));
        let response4 = await database.from('usersettings').select('middle_name').match({id: info[2]});
        assert(response4.data && response4.data[0]?.middle_name === 'R.', 'last name should have changed');

        //can change bio, and public_or_private
        await database.from('usersettings').update({ public_or_private: 'notReal' }).eq('id', info[2])
        let response_bad = await database.from('usersettings').select('public_or_private').match({id: info[2]});
        assert(response_bad.data && (response_bad.data[0]?.public_or_private === 'public' || response_bad.data[0]?.public_or_private 
            === 'private'), 'should not be able to set public_or_private to notReal');

        await assert.doesNotReject(changePublicOrPrivate('public', info[2], database));
        let response_public = await database.from('usersettings').select('public_or_private').match({id: info[2]});
        assert(response_public.data && response_public.data[0]?.public_or_private === 'public', 'privacy setting should have changed');

        await assert.doesNotReject(changePublicOrPrivate('private', info[2], database));
        let response_private = await database.from('usersettings').select('public_or_private').match({id: info[2]});
        assert(response_private.data && response_private.data[0]?.public_or_private === 'private', 'privacy setting should have changed');

        await assert.doesNotReject(changeBio('bio hehe', info[2], database));
        let response_bio = await database.from('usersettings').select('bio').match({id: info[2]});
        assert(response_bio.data && response_bio.data[0]?.bio === 'bio hehe', 'bio should have changed');

        signOut(info[0], database);
    });

    it.skip('check security', async function () {
        const database: SupabaseClient<Database> = await getSupabaseClient();

        //supabase handles authentication with jwt-tokens, revoking them, checking if a refresh token has been used twice, etc.

        //should not be able to change the id or email
        await assert.rejects(changePassword(database, 'Beta0893'), 'changing password should not work if not signed in');

        const[token, rtoken, id ] = await signInAndGetToken('c@c.com', 'Alphabet08', database);
        database.from('usersettings').update({email: 'a@gmail.com', id: 'a966ab4c-f262-4e79-ad05-a39b589cd033'});
        let response = await database.from('usersettings').select('email').match({id: id});

        response = await database.from('usersettings').select('email').match({id: id});
        assert(response.data && response.data[0]?.email === 'c@c.com');
        assert(response.data.length === 1, 'should only be one user with this id');

        response = await database.from('usersettings').select('email').match({id: 'a966ab4c-f262-4e79-ad05-a39b589cd033'});
        assert(response.data && response.data.length === 0, 'id should not have changed');

        //should not be able to use the same username or email for multiple accounts
        await assert.rejects(createUser('a@a.com', 'Alphabet08', database), 'should not be able to create a user with the same email');

        //should not be able to get rid of the username, first name, or last name after setting it
        await assert.rejects(changeUsername('', id, database));
        await assert.rejects(changeLastName('', id, database));
        await assert.rejects(changeFirstName('', id, database));

        //can change middle name to empty string
        await assert.doesNotReject(changeMiddleName('', id, database));
    });

    it('profile picture works'), function (){
        assert.fail('profile picture is not implemented yet');
    };

    it('correct categories show up on user page, in timeline order', async function () {
        //all posts category will show up at the bottom
        assert.fail('user page is not implemented yet');
    });
});