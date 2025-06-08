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
//import { asyncTimer } from '../utils.js';
const test_js_1 = require("../test.js");
//This file tests modifiying user settings (permissions), different ways of signing in, and what happens when a user
//is deleted or added.
describe('users and user settings', function () {
    this.timeout(5000); // Set a timeout for the tests to run, as some operations may take longer
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
    it.skip('deleting all the users should work', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const database = yield (0, auth_js_1.getSupabaseClient)();
            yield (0, test_js_1.deleteTestingUsers)(database);
        });
    });
    it.skip('Testing EMAIL sign up with and without an account', function () {
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
            yield node_assert_1.default.doesNotReject((0, auth_js_1.createUser)('a@a.com', 'Alphabet08', database), 'valid password should work');
            node_assert_1.default.rejects((0, auth_js_1.createUser)('a@a.com', 'Alphabet08', database), 'already created account should not work');
            let [token, refresh_token, user_id] = yield (0, auth_js_1.signInAndGetToken)('a@a.com', 'Alphabet08', database);
            (0, auth_js_1.signOut)(token, database);
            yield asyncTimer(100); // wait for a second to make sure the account is created
            node_assert_1.default.rejects((0, auth_js_1.deleteAccount)(database), 'deleting account without being signed in should not work');
            [token, refresh_token, user_id] = yield (0, auth_js_1.signInAndGetToken)('a@a.com', 'Alphabet08', database);
            yield (0, auth_js_1.deleteAccount)(database);
        });
    });
    it.skip('creating all the users should work', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const database = yield (0, auth_js_1.getSupabaseClient)();
            yield (0, test_js_1.createTestingUsers)(database);
        });
    });
    it.skip('changing passwords should work', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const database = yield (0, auth_js_1.getSupabaseClient)();
            let [token, refresh_token, user_id] = yield (0, auth_js_1.signInAndGetToken)('a@a.com', 'Alphabet08', database);
            // Change password
            yield node_assert_1.default.rejects((0, auth_js_1.changePassword)(database, 'acdefghijK'), 'password should be at least 8 characters long');
            yield node_assert_1.default.doesNotReject((0, auth_js_1.changePassword)(database, 'Beta0893'), 'changing password should work');
            yield (0, auth_js_1.signOut)(token, database);
            yield node_assert_1.default.rejects((0, auth_js_1.signInAndGetToken)('a@a.com', 'Alphabet08', database));
            [token, refresh_token, user_id] = yield (0, auth_js_1.signInAndGetToken)('a@a.com', 'Beta0893', database);
            yield (0, auth_js_1.changePassword)(database, 'Alphabet08'); // Change back to original password
            (0, auth_js_1.signOut)(token, database);
        });
    });
    it('oathSignIn should work', function () {
        return __awaiter(this, void 0, void 0, function* () {
            (0, node_assert_1.default)(false, 'oathSignIn is not implemented yet');
        });
    });
    it('changing user settings should work', function () {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            const database = yield (0, auth_js_1.getSupabaseClient)();
            //can change first name, last name, middle name, bio,
            //public_or_private, and username
            //sign in with a user that has no first_name, last_name, or middle_name
            const info = (yield (0, auth_js_1.signInAndGetToken)('a@a.com', 'Alphabet08', database));
            yield node_assert_1.default.doesNotReject((0, auth_js_1.changeUsername)('cool_username', info[2], database));
            //check that the username was created
            let response = yield database.from('usersettings').select('username').match({ id: info[2] });
            (0, node_assert_1.default)(response.data && ((_a = response.data[0]) === null || _a === void 0 ? void 0 : _a.username) === 'cool_username', 'username should have been created');
            //check that we can change the username
            yield node_assert_1.default.doesNotReject((0, auth_js_1.changeUsername)('cooler_username', info[2], database));
            response = yield database.from('usersettings').select('username').match({ id: info[2] });
            (0, node_assert_1.default)(response.data && ((_b = response.data[0]) === null || _b === void 0 ? void 0 : _b.username) === 'cooler_username', 'username should have changed');
            //quick logging to make sure that the assertions are working
            if (response.data) {
                console.log('response', (_c = response.data[0]) === null || _c === void 0 ? void 0 : _c.username);
            }
            else {
                console.log('response data is null');
            }
            //create a user with first_name, last_name, and middle_name
            yield node_assert_1.default.doesNotReject((0, auth_js_1.changeFirstName)('Em', info[2], database));
            let response2 = yield database.from('usersettings').select('first_name').match({ id: info[2] });
            (0, node_assert_1.default)(response2.data && ((_d = response2.data[0]) === null || _d === void 0 ? void 0 : _d.first_name) === 'Em', 'first name should have changed');
            yield node_assert_1.default.doesNotReject((0, auth_js_1.changeLastName)('my', info[2], database));
            let response3 = yield database.from('usersettings').select('last_name').match({ id: info[2] });
            (0, node_assert_1.default)(response3.data && ((_e = response3.data[0]) === null || _e === void 0 ? void 0 : _e.last_name) === 'my', 'last name should have changed');
            yield node_assert_1.default.doesNotReject((0, auth_js_1.changeMiddleName)('R.', info[2], database));
            let response4 = yield database.from('usersettings').select('middle_name').match({ id: info[2] });
            (0, node_assert_1.default)(response4.data && ((_f = response4.data[0]) === null || _f === void 0 ? void 0 : _f.middle_name) === 'R.', 'last name should have changed');
            //can change bio, and public_or_private
            yield database.from('usersettings').update({ public_or_private: 'notReal' }).eq('id', info[2]);
            let response_bad = yield database.from('usersettings').select('public_or_private').match({ id: info[2] });
            (0, node_assert_1.default)(response_bad.data && (((_g = response_bad.data[0]) === null || _g === void 0 ? void 0 : _g.public_or_private) === 'public' || ((_h = response_bad.data[0]) === null || _h === void 0 ? void 0 : _h.public_or_private)
                === 'private'), 'should not be able to set public_or_private to notReal');
            yield node_assert_1.default.doesNotReject((0, auth_js_1.changePublicOrPrivate)('public', info[2], database));
            let response_public = yield database.from('usersettings').select('public_or_private').match({ id: info[2] });
            (0, node_assert_1.default)(response_public.data && ((_j = response_public.data[0]) === null || _j === void 0 ? void 0 : _j.public_or_private) === 'public', 'privacy setting should have changed');
            yield node_assert_1.default.doesNotReject((0, auth_js_1.changePublicOrPrivate)('private', info[2], database));
            let response_private = yield database.from('usersettings').select('public_or_private').match({ id: info[2] });
            (0, node_assert_1.default)(response_private.data && ((_k = response_private.data[0]) === null || _k === void 0 ? void 0 : _k.public_or_private) === 'private', 'privacy setting should have changed');
            yield node_assert_1.default.doesNotReject((0, auth_js_1.changeBio)('bio hehe', info[2], database));
            let response_bio = yield database.from('usersettings').select('bio').match({ id: info[2] });
            (0, node_assert_1.default)(response_bio.data && ((_l = response_bio.data[0]) === null || _l === void 0 ? void 0 : _l.bio) === 'bio hehe', 'bio should have changed');
            (0, auth_js_1.signOut)(info[0], database);
        });
    });
    it('check security', function () {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const database = yield (0, auth_js_1.getSupabaseClient)();
            //supabase handles authentication with jwt-tokens, revoking them, checking if a refresh token has been used twice, etc.
            //should not be able to change the id or email
            yield node_assert_1.default.rejects((0, auth_js_1.changePassword)(database, 'Beta0893'), 'changing password should not work if not signed in');
            const [token, rtoken, id] = yield (0, auth_js_1.signInAndGetToken)('c@c.com', 'Alphabet08', database);
            database.from('usersettings').update({ email: 'a@gmail.com', id: 'a966ab4c-f262-4e79-ad05-a39b589cd033' });
            let response = yield database.from('usersettings').select('email').match({ id: id });
            response = yield database.from('usersettings').select('email').match({ id: id });
            (0, node_assert_1.default)(response.data && ((_a = response.data[0]) === null || _a === void 0 ? void 0 : _a.email) === 'c@c.com');
            (0, node_assert_1.default)(response.data.length === 1, 'should only be one user with this id');
            response = yield database.from('usersettings').select('email').match({ id: 'a966ab4c-f262-4e79-ad05-a39b589cd033' });
            (0, node_assert_1.default)(response.data && response.data.length === 0, 'id should not have changed');
            //should not be able to use the same username or email for multiple accounts
            yield node_assert_1.default.rejects((0, auth_js_1.createUser)('a@a.com', 'Alphabet08', database), 'should not be able to create a user with the same email');
            //should not be able to get rid of the username, first name, or last name after setting it
            yield node_assert_1.default.rejects((0, auth_js_1.changeUsername)('', id, database));
            yield node_assert_1.default.rejects((0, auth_js_1.changeLastName)('', id, database));
            yield node_assert_1.default.rejects((0, auth_js_1.changeFirstName)('', id, database));
            //can change middle name to empty string
            yield node_assert_1.default.doesNotReject((0, auth_js_1.changeMiddleName)('', id, database));
        });
    });
});
function asyncTimer(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
