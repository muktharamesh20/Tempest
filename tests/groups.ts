import assert from 'node:assert';

import path from 'node:path';
import fs from 'node:fs';

import {getSupabaseClient, createUser, deleteUser, signInAndGetToken, signOut, useSupaBaseRefreshToken, oathSignIn, deleteAccount, changePassword} from '../auth.js';

//This file checks that when deleting or archiving groups, certain things happen
//Also checks how roles play into things, how default viewership tags work, whether the calendar is public, events that are assigned by people in the group to other people in the group, and more

describe('signing_up_users', function () {
    /**
     * Testing strategy:
     *
     * Things to check:
     *      join requests
     *      invite requests
     *      above based on roles (ie owner admin general)
     *      creating todos and events
     *      setting up special events
     *      changing home page based on public or private
     *      changing home page based on categories
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