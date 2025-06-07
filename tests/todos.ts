import assert from 'node:assert';

import path from 'node:path';
import fs from 'node:fs';

import {getSupabaseClient, createUser, signInAndGetToken, signOut, useSupaBaseRefreshToken, oathSignIn, deleteAccount, changePassword} from '../auth.js';

//This file tests creating todos, as well as deleting todos.  It checks viewership, who can complete the todos, and more

describe('signing_up_users', function () {
    /**
     * Testing strategy:
     *
     * Things to test:
     *      adding/removing notes concurrently
     *      assigning group members todos
     *      assigning all group members todos
     *      group being deleted
     *      group being archived
     *      being removed from a group
     *      not inputting correct fields
     *      checking if default viewership tags are correct
     *          based on whether account is public or private, which categories are attached, and what the group
     *          default categories are
     *      checking that updating default viewership works
     *      creating a post that links back to this works, viewership is inherited
     *      completing a todo works
     *      recurring todos work
     *      sub-todos work
     *      assigned todos switch to you if the assignee gets deleted
     *      can delete assigned todos, but the assignee can still see it
     *      can block people from assigning todos to you
     *      can be inspired by a todo (from a post or friend)
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