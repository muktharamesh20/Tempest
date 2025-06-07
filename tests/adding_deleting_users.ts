import { AuthSessionMissingError, createClient,  JwtPayload, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../databasetypes'
import assert from 'node:assert';

import path from 'node:path';
import fs from 'node:fs';

import {getSupabaseClient, createUser, signInAndGetToken, signOut, useSupaBaseRefreshToken, oathSignIn, deleteAccount, changePassword, verifyToken} from '../auth.js';
//import { asyncTimer } from '../utils.js';
import {createTestingUsers, deleteTestingUsers} from '../test.js'
import { create } from 'node:domain';

//This file tests modifiying user settings (permissions), different ways of signing in, and what happens when a user
//is deleted or added.

describe('users and user settings', function () {
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
     *      partition on birthday: above 13, under 13
     * 
     * profile picture:
     *      partition on default: set pp, did not set pp
     * 
     * manually_approve_tags
     *      partiton on setting: yes, no
     *      partition on switching with tags in the waiting list: yes, no
     * 
     * change_email()
     *      partition on changed email, no changed email
     * 
     * change_username():
     *      partition on changed username, not changed username
     *      partition on valid username, not valid username
     * 
     * reporting_people:
     *      partition on number of reports, types of reports
     *      partition on requesting review, how it shows up on our supabase
     *                    system
     * 
     * setting up user_page:
     *      partition on tab: tags, home page
     *      partition on categories: make sure it's in correct order, and only
     *                               the categories you want show up on your home page
     * 
     */

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
        
        assert.doesNotReject(createUser('a@a.com', 'Alphabet08', database), 'valid password should work');

        await asyncTimer(200); // wait for a second to make sure the account is created
        assert.rejects(createUser('a@a.com', 'Alphabet08', database), 'already created account should not work');

        let [token, refresh_token, user_id] = await signInAndGetToken('a@a.com', 'Alphabet08', database);
        signOut(token, database);

        await asyncTimer(100); // wait for a second to make sure the account is created
        assert.rejects(deleteAccount(database), 'deleting account without being signed in should not work');
        [token, refresh_token, user_id] = await signInAndGetToken('a@a.com', 'Alphabet08', database);

        await deleteAccount(database);
    });

    it('modifying user settings should work', async function () {
        const database: SupabaseClient<Database> = await getSupabaseClient();
    });
});

// Removed duplicate implementation of asyncTimer
function asyncTimer(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}