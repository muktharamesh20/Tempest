import assert from 'node:assert';

import path from 'node:path';
import fs from 'node:fs';

import {getSupabaseClient, createUser, signInAndGetToken, signOut, useSupaBaseRefreshToken, oathSignIn, deleteAccount, changePassword} from '../all_methods/auth.js';

// This file tests creating viewership tags, deleting viewership tags, and seeing which viewership tags show up when querying, etc.

describe('signing_up_users', function () {
    /**
     * Testing strategy:
     *
     * Ownership of vt:
     *      partition on ownership: group, individual, both, neither
     *      partition on followers_or_all, followers, all
     *      partition on friends: close friends, friends, not friends
     * 
     * Things to test:
     *      already viewed post
     *      liked similar post
     *      SECURITY
     *      BEST NOTIFICATION TO NOTIFY
     * 
     */
    it('a subtest thingy', function () {
    });
});

describe('adding_deleting_users', function () {
    it('a subtest thingy', function () {
    });
});