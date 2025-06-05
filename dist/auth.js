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
exports.getSupabaseClient = getSupabaseClient;
exports.createUser = createUser;
exports.deleteUser = deleteUser;
exports.verifyToken = verifyToken;
exports.decodeToken = decodeToken;
exports.signInAndGetToken = signInAndGetToken;
exports.signOut = signOut;
exports.useSupaBaseRefreshToken = useSupaBaseRefreshToken;
const supabase_js_1 = require("@supabase/supabase-js");
const assert_1 = __importDefault(require("assert"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
//allows us to use process.env to get environment variables
dotenv_1.default.config();
// Create a single supabase client for interacting with your database
function getSupabaseClient() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const supabase = (0, supabase_js_1.createClient)((_a = process.env.NEXT_PUBLIC_SUPABASE_URL) !== null && _a !== void 0 ? _a : assert_1.default.fail('NEXT_PUBLIC_SUPABASE_URL is not defined'), (_b = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) !== null && _b !== void 0 ? _b : assert_1.default.fail('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined'), {
            auth: {
                flowType: 'pkce',
                autoRefreshToken: false,
                persistSession: true,
                detectSessionInUrl: true
            }
        });
        return supabase;
    });
}
//helper functions to interact with the database
//--------------------------------------------Authentication Functions--------------------------------------------------//
function createUser(email, password, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient.auth.signUp({
            email,
            password,
        });
        if (error) {
            console.error('Error creating user:', error.message);
            throw error;
        }
        console.log('User created successfully:', data);
    });
}
//TODO: DOES NOT WORK YET
function deleteUser(email, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient.auth.admin.deleteUser('5e3ae116-297b-41cd-93a8-a1d55af10f1e');
        if (error) {
            console.error('Error deleting user:', error.message);
            throw error;
        }
        console.log('User deleted successfully:', data);
    });
}
/**
 * Verifies a JWT token and returns the decoded user information.
 *
 * @param token - The JWT token to verify.
 * @returns the decoded user information from the JWT token (has id attribute)
 * @throws Will throw an error if the JWT secret is not defined or if the token is invalid.
 */
function verifyToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const decodedData = jsonwebtoken_1.default.verify(token, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : assert_1.default.fail('NEXT_PUBLIC_SUPABASE_JWT_SECRET is not defined'), { algorithms: ['HS256'] });
        (0, assert_1.default)(decodedData.iss === 'https://vjdjrmuhojwprugppufd.supabase.co/auth/v1', 'Token issuer does not match Supabase URL');
        //console.log('current tiem:', Math.floor(Date.now() / 1000));
        //assert(decodedData.exp > Math.floor(Date.now() / 1000), 'Token has expired');
        return decodedData;
    });
}
/**
 * Decodes a JWT token without verifying its signature or that its expired (in string format).
 *
 * @param token - The JWT token to decode.
 * @returns the payload of the JWT token as a JWT token.
 * @throws Will throw an error if the token cannot be decoded.
 */
function decodeToken(token) {
    var _a;
    const decodedData = (_a = jsonwebtoken_1.default.decode(token, { complete: true })) !== null && _a !== void 0 ? _a : assert_1.default.fail('Failed to decode token');
    return decodedData;
}
/**
 * Tries to sign the user in with a username and password, and returns the access token and refresh token.
 *
 * @param email email of the user
 * @param password password of the user
 * @returns access token and refresh token and the userid as a tuple
 * @throws Will throw an error if the login fails
 */
function signInAndGetToken(email, password, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            console.error('Login error:', error.message);
            throw error;
        }
        const accessToken = data.session.access_token;
        const refreshToken = data.session.refresh_token;
        console.log('✅ Access Token:', accessToken);
        console.log('🔁 Refresh Token:', refreshToken);
        console.log(data.session);
        return [accessToken, refreshToken, data.session.user.id];
    });
}
/**
 * Signs out the user from both the client and server side.
 *
 * @param token JWT token of the user to sign out
 * @param scope Optional scope to specify which sessions to sign out ('global', 'local', or 'others')
 * @throws Will throw an error if the sign out fails (already signed out, invalid token, etc.) Will throw
 * AuthSessionMissingError if the token is invalid or the session has expired.
 */
function signOut(token, supabaseClient, scope) {
    return __awaiter(this, void 0, void 0, function* () {
        //const { error } = await supabase.auth.signOut();
        const { error: revokeError } = yield supabaseClient.auth.admin.signOut(token, scope);
        if (revokeError) {
            if (revokeError instanceof supabase_js_1.AuthSessionMissingError) {
                console.error('Unauthorized: Invalid token or session expired');
            }
            else {
                console.error('Server-side sign out error:', revokeError.message);
            }
            ;
            throw revokeError;
        }
        //if (error) {
        //console.error('Sign out error:', error.message)
        //throw error
        //}
        console.log('✅ Successfully signed out');
    });
}
/**
 * Refreshes the access token using the provided refresh token.
 * Note: This will fail if the refresh token is expired or invalid.
 * @param refreshToken - The refresh token to use for signing in.
 * @return A tuple containing the new access token and refresh token.
 */
function useSupaBaseRefreshToken(refreshToken, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient.auth.refreshSession({ refresh_token: refreshToken });
        if (error) {
            console.error('Refresh token error:', error.message);
            throw error;
        }
        if (!data.session) {
            throw new Error('No session data returned from refreshSession');
        }
        const accessToken = data.session.access_token;
        const newRefreshToken = data.session.refresh_token;
        console.log('✅ New Access Token:', accessToken);
        console.log('🔁 New Refresh Token:', newRefreshToken);
        return [accessToken, newRefreshToken];
    });
}
function oathSignIn(supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        // This function is not implemented yet, but it will handle OAuth sign-in
        // using the Supabase client.
        supabaseClient.auth.signInWithOAuth({
            provider: 'google', // or any other OAuth provider supported by Supabase
            options: {
                redirectTo: 'http://localhost:3000/auth/callback', // replace with your redirect URL after they are confirmed
                scopes: 'email profile',
            }
        });
        throw new Error('OAuth sign-in is not implemented yet.');
    });
}
function deleteAccount(supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        // This function is not implemented yet, but it will handle account deletion
        // using the Supabase client.
        const { error } = yield supabaseClient.auth.admin.deleteUser('5e3ae116-297b-41cd-93a8-a1d55af10f1e'); // replace with actual user ID
        if (error) {
            console.error('Error deleting account:', error.message);
            throw error;
        }
        console.log('Account deleted successfully');
    });
}
//--------------------------------------------Main Function--------------------------------------------------//
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const supabaseClient = yield getSupabaseClient();
        yield createUser("muktharamesh20@gmail.com", "AthenaWarrior0212*", supabaseClient);
        let [token, refreshToken] = yield signInAndGetToken('muktharamesh20@gmail.com', 'AthenaWarrior0212*', supabaseClient);
        try {
            [token, refreshToken] = yield useSupaBaseRefreshToken(refreshToken, supabaseClient);
        }
        catch (error) {
            console.error('Error refreshing token:', error);
            //throw error; // Re-throw the error or handle it appropriately
        }
        console.log(jsonwebtoken_1.default.decode(token, { complete: true }));
        console.log(yield verifyToken(token));
        try {
            yield signOut(token, supabaseClient, 'global');
        }
        catch (error) {
            console.error('Error signing out:', error);
        }
    });
}
//main()
