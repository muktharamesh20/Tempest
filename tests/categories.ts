import assert from 'node:assert';

import path from 'node:path';
import fs from 'node:fs';

import {getSupabaseClient, createUser, signInAndGetToken, signOut, useSupaBaseRefreshToken, oathSignIn, deleteAccount, changePassword} from '../all_methods/auth.js';

//this file tests creating categories, deleting categories, seeing which categories show up when querying, etc
//It also tests the analytical capabilities of the different categories

describe('signing_up_users', function () {
    /**
     * Testing strategy:
     * 
     * SECURITY
     *
     * creating categories
     * when creating a group, a category is automatically created for it
     * when you leave that group, what happens to the category tags (a private one is
     * created for your posts, with a setting that links to the old group in case you join
     * it again)
     *      rejoining the group after that, regetting the category tag on your posts
     * having default viewership settigns for each category
     * analytics on all the categories
     * 1se, picture a day yearly recaps
     */
    it('a subtest thingy', function () {
    });
});

describe('adding_deleting_users', function () {
    it('a subtest thingy', function () {
    });
});