import assert from 'node:assert';

import path from 'node:path';
import fs from 'node:fs';

import {getSupabaseClient, createUser, deleteUser, signInAndGetToken, signOut, useSupaBaseRefreshToken, oathSignIn, deleteAccount, changePassword} from '../auth.js';

//This file checks the right people see posts, that when a post is attached to a todo, it inherits the todo's tags unless 
//otherwise specified, if a category is added to a post it shows up in the category and those vt's are also inherited, 
//and more, when a post attached to a todo has a dissappeared todo what happens

describe('signing_up_users', function () {
    /**
     * Testing strategy:
     *
     * drawGrid():
     *      partition on output: blank, drawn
     */
    it('a subtest thingy', function () {
    });
});

describe('adding_deleting_users', function () {
    it('a subtest thingy', function () {
    });
});