import assert from 'node:assert';

import path from 'node:path';
import fs from 'node:fs';

import {getSupabaseClient, createUser, deleteUser, signInAndGetToken, signOut, useSupaBaseRefreshToken, oathSignIn, deleteAccount, changePassword} from '../auth.js';

//This file tests creating todos, as well as deleting todos.  It checks viewership, who can complete the todos, and more

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