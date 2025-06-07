import assert from 'node:assert';

import path from 'node:path';
import fs from 'node:fs';

import {getSupabaseClient, createUser, deleteUser, signInAndGetToken, signOut, useSupaBaseRefreshToken, oathSignIn, deleteAccount, changePassword} from '../auth.js';

// This file tests creating viewership tags, deleting viewership tags, and seeing which viewership tags show up when querying, etc.

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