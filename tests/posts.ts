import assert from 'node:assert';

import path from 'node:path';
import fs from 'node:fs';

import {getSupabaseClient, createUser, deleteUser, signInAndGetToken, signOut, useSupaBaseRefreshToken, oathSignIn, deleteAccount, changePassword} from '../auth.js';

//This file checks the right people see posts, that when a post is attached to a todo, it inherits the todo's tags unless 
//otherwise specified, if a category is added to a post it shows up in the category and those vt's are also inherited, 
//and more, when a post attached to a todo has a dissappeared todo what happens

//interacting with posts with inspired, likes, comments, etc as well

describe('signing_up_users', function () {
    /**
     * Things to test:
     *      liking a post: owner vs not owner vs not even a follower
     *      commenting on a post
     *      adding a group tag
     *      deleting the group (viewership tag needs to become private
     *                              with all the old people in the group,
     *                              private category created)
     *      leaving a group (viewership tag is removed,
     *                       private category created)
     *      group removes you (viewership tag is removed,
     *                          private category created)
     *      Ownership of vt:
     *          partition on ownership: group, individual, both, neither
     *          partition on followers_or_all, followers, all
     *          partition on friends: close friends, friends, not friends
     *      has picture or doesn't have picture
     *      if inspired by the todo that the post is inspired by, does the inspired
     *          count go up for the post?
     *      if the same person tries inspiring a bunch
     *      if the same person tries liking a bunch
     *      if the same person tries saving a bunch
     *      retrieving the people who liked the post
     *      putting a post in highlights
     *      
     */
    it('a subtest thingy', function () {
    });
});

describe('adding_deleting_users', function () {
    it('a subtest thingy', function () {
    });
});