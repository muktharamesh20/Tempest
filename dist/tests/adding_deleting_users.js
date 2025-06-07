"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const auth_js_1 = require("../auth.js");
//This file tests modifiying user settings (permissions), different ways of signing in, and what happens when a user
//is deleted or added.
describe('users and user settings', function () {
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
    it('Testing EMAIL sign up with and without an account', function () {
        return __awaiter(this, void 0, void 0, function* () {
            //setup
            const database = yield (0, auth_js_1.getSupabaseClient)();
            //checking invalid sign-in, passwords require 8 letters, lowercase/uppercase letters and digits
            node_assert_1.default.rejects((0, auth_js_1.signInAndGetToken)('a@a.com', 'Alphabet08', database), 'account doesn\'t exists');
            node_assert_1.default.rejects((0, auth_js_1.createUser)('a@a.com', 'a', database), 'no uppercase letters');
            node_assert_1.default.rejects((0, auth_js_1.createUser)('a@a.com', 'abcabc', database), 'too short of a password');
            node_assert_1.default.rejects((0, auth_js_1.createUser)('a@a.com', 'AbcdefghiJ', database), 'no digits in password');
            node_assert_1.default.rejects((0, auth_js_1.createUser)('a@a.com', 'ab83jd', database), 'too short of a password');
            node_assert_1.default.rejects((0, auth_js_1.createUser)('a@a.com', '*Alphabet', database), 'no digits in password');
            node_assert_1.default.doesNotReject((0, auth_js_1.createUser)('a@a.com', 'Alphabet08', database), 'valid password should work');
            yield asyncTimer(200); // wait for a second to make sure the account is created
            node_assert_1.default.rejects((0, auth_js_1.createUser)('a@a.com', 'Alphabet08', database), 'already created account should not work');
            let [token, refresh_token, user_id] = yield (0, auth_js_1.signInAndGetToken)('a@a.com', 'Alphabet08', database);
            (0, auth_js_1.signOut)(token, database);
            yield asyncTimer(100); // wait for a second to make sure the account is created
            node_assert_1.default.rejects((0, auth_js_1.deleteAccount)(database), 'deleting account without being signed in should not work');
            [token, refresh_token, user_id] = yield (0, auth_js_1.signInAndGetToken)('a@a.com', 'Alphabet08', database);
            yield (0, auth_js_1.deleteAccount)(database);
        });
    });
    it('modifying user settings should work', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const database = yield (0, auth_js_1.getSupabaseClient)();
        });
    });
});
// Removed duplicate implementation of asyncTimer
function asyncTimer(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
