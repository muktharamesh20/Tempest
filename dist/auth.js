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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const assert_1 = __importDefault(require("assert"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
//allows us to use process.env to get environment variables
dotenv_1.default.config();
// Create a single supabase client for interacting with your database
const supabase = (0, supabase_js_1.createClient)((_a = process.env.NEXT_PUBLIC_SUPABASE_URL) !== null && _a !== void 0 ? _a : assert_1.default.fail('NEXT_PUBLIC_SUPABASE_URL is not defined'), (_b = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) !== null && _b !== void 0 ? _b : assert_1.default.fail('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined'), {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    }
});
//helper functions to interact with the database
//--------------------------------------------Authentication Functions--------------------------------------------------//
/**
 * Verifies a JWT token and returns the decoded user information.
 *
 * @param token - The JWT token to verify.
 * @returns the decoded user information from the JWT token.
 * @throws Will throw an error if the JWT secret is not defined or if the token is invalid.
 */
function verifyToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const decodedData = jsonwebtoken_1.default.verify(token, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : assert_1.default.fail('NEXT_PUBLIC_SUPABASE_JWT_SECRET is not defined'), { algorithms: ['HS256'] });
        //console.log('current tiem:', Math.floor(Date.now() / 1000));
        //assert(decodedData.exp > Math.floor(Date.now() / 1000), 'Token has expired');
        return decodedData;
    });
}
/**
 * Decodes a JWT token without verifying its signature or that its expired (in string format).
 *
 * @param token - The JWT token to decode.
 * @returns the payload of the JWT token as a string.
 */
function decodeToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const decodedData = (_a = jsonwebtoken_1.default.decode(token, { complete: true })) !== null && _a !== void 0 ? _a : assert_1.default.fail('Failed to decode token');
        return decodedData.payload;
    });
}
function signInAndGetToken(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabase.auth.signInWithPassword({
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
        return [accessToken, refreshToken];
    });
}
/**
 * Signs out the user from both the client and server side.
 *
 * @param session
 */
function signOut(token, scope) {
    return __awaiter(this, void 0, void 0, function* () {
        //const { error } = await supabase.auth.signOut();
        const { error: revokeError } = yield supabase.auth.admin.signOut(token, scope);
        if (revokeError) {
            if (revokeError instanceof supabase_js_1.AuthSessionMissingError) {
                console.error('Unauthorized: Invalid token or session expired');
            }
            else {
                console.error('Server-side sign out error:', revokeError.message);
                throw revokeError;
            }
            ;
        }
        //if (error) {
        //console.error('Sign out error:', error.message)
        //throw error
        //}
        console.log('✅ Successfully signed out');
    });
}
/**
 *
 */
function useRefreshToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabase.auth.refreshSession({ refresh_token: refreshToken });
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
//--------------------------------------------Main Function--------------------------------------------------//
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let [token, refreshToken] = yield signInAndGetToken('muktharamesh21@gmail.com', 'kiddo*');
        try {
            [token, refreshToken] = yield useRefreshToken(refreshToken);
        }
        catch (error) {
            console.error('Error refreshing token:', error);
            //throw error; // Re-throw the error or handle it appropriately
        }
        console.log(yield jsonwebtoken_1.default.decode(token, { complete: true }));
        console.log(yield verifyToken(token));
        try {
            yield signOut(token, 'global');
        }
        catch (error) {
            console.error('Error signing out:', error);
        }
    });
}
main();
