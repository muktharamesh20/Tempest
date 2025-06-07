import { AuthSessionMissingError, createClient,  JwtPayload, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../databasetypes'
import assert from 'node:assert';

import path from 'node:path';
import fs from 'node:fs';

import {getSupabaseClient, createUser, deleteUser, signInAndGetToken, signOut, useSupaBaseRefreshToken, oathSignIn, deleteAccount, changePassword} from '../auth.js';

//This file tests modifiying user settings (permissions), different ways of signing in, and what happens when a user
//is deleted or added.


describe('signing_up_users', function () {
    /**
     * Testing strategy:
     * 
     * SECURITY
     * NOTIFICATIONS
     *
     * Changing password:
     *      partition on validity: valid, invalid
     *      partition on account: existing, non-existing, deleted
     * 
     * oathSignIn():
     *      partition on sign-in worked, sign-in didn't work
     * 
     * partition viewership after log-in:
     *      partition on login method: oauth, email
     *      partition on completed profile: first_name, last_name
     *      partition on attempting to remove first_name and last_name
     *      partition on birthday: above 13, under 13
     * 
     * profile picture:
     *      partition on default: set pp, did not set pp
     * 
     * manually_approve_tags
     *      partiton on setting: yes, no
     *      partition on switching with tags in the waiting list: yes, no
     * 
     * change_email()
     *      partition on changed email, no changed email
     * 
     * change_username():
     *      partition on changed username, not changed username
     *      partition on valid username, not valid username
     * 
     * reporting_people:
     *      partition on number of reports, types of reports
     *      partition on requesting review, how it shows up on our supabase
     *                    system
     * 
     * setting up user_page:
     *      partition on tab: tags, home page
     *      partition on categories: make sure it's in correct order, and only
     *                               the categories you want show up on your home page
     * 
     */
    it('a subtest thingy', async function () {
        const database: SupabaseClient<Database> = await getSupabaseClient();


    });
});

describe('adding_deleting_users', function () {
    it('a subtest thingy', async function () {
    });
});