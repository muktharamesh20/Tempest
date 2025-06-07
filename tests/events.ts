import assert from 'node:assert';

import path from 'node:path';
import fs from 'node:fs';

import {getSupabaseClient, createUser, deleteUser, signInAndGetToken, signOut, useSupaBaseRefreshToken, oathSignIn, deleteAccount, changePassword} from '../auth.js';

//This file tests creating events, and whether events can be created, deleted, and queried correctly.
//It tests how adding multiple vt's work, how adding multiple categories work, how ownership of an event based on groups vs actual individuals work, how inviting people to an event works, and more like close friends group calendars, and more.


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