import assert from 'node:assert';

import path from 'node:path';
import fs from 'node:fs';

import {getSupabaseClient, createUser, signInAndGetToken, signOut, useSupaBaseRefreshToken, oathSignIn, deleteAccount, changePassword} from '../auth.js';

// This file tests following followers and close friends, and whether the following functionality works correctly.


describe('signing_up_users', function () {
    /**
     * Testing strategy:
     *
     * Things to test:
     *      creating a follow request
     *      accepting a follow request
     *      creating a follow request to a public user 
     *      becoming a public user with follow requests piled up (should auto accept them)
     *      SECURITY
     *      NOTIFICATIONS
     */
    it('a subtest thingy', function () {
    });
});

describe('adding_deleting_users', function () {
    it('a subtest thingy', function () {
    });
});