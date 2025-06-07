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
     * Things to test:
     *      special event shows up in group
     *      categories work correctly, whether its group or individual
     *      when removing/changing a specific day from a recurring event, it is managed properly
     *      if you don't want it to come from a group, defaults in the group make it not viewable in your calendar for yourself or others
     *      if you want it private to yourself, defaults in the group make it not viewable to otehers
     *      inviting people to events
     *      creating posts from special events in groups, or your own special events
     *      SECURITY
     *      NOTIFICATIONS (ie when you invite people)
     */
    it('a subtest thingy', function () {
    });
});

describe('adding_deleting_users', function () {
    it('a subtest thingy', function () {
    });
});