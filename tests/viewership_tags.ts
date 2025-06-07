import assert from 'node:assert';

import path from 'node:path';
import fs from 'node:fs';

import {getSupabaseClient, createUser, deleteUser, signInAndGetToken, signOut, useSupaBaseRefreshToken, oathSignIn, deleteAccount, changePassword} from '../auth.js';

// This file tests creating viewership tags, deleting viewership tags, and seeing which viewership tags show up when querying, etc.

describe('signing_up_users', function () {
    /**
     * Testing strategy:
     * 
     * SECURITY
     * NOTIFICATIONS
     *
     * Ownership of vt:
     *      partition on ownership: group, individual, both, neither
     *      partition on followers_or_all, followers, all
     *      partition on friends: close friends, friends, not friends
     * 
     * if there's a bunch, and then archive is added
     *      - I think it should just go to archive actually
     * if there's a bunch and then public is added
     * if there are no viewrship tags
     * 
     * Other things to test
     *      setting up default group ids (just normal followers firs)
     *      changing an event or post to different vt
     *      going back to default (saves your old preferences?  maybe its a switch instead?)
     *      default category vt's
     *      default category vt's when its a group category (how do you make your own?)
     *      add ai suggested vts?
     * 
     */
    it('a subtest thingy', function () {
    });
});

describe('adding_deleting_users', function () {
    it('a subtest thingy', function () {
    });
});