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
        (0, assert_1.default)(decodedData.exp > Math.floor(Date.now() / 1000), 'Token has expired');
        return decodeToken(token);
    });
}
/**
 * Decodes a JWT token without verifying its signature or that its expired.
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
            return "error";
        }
        const accessToken = data.session.access_token;
        const refreshToken = data.session.refresh_token;
        console.log('✅ Access Token:', accessToken);
        console.log('🔁 Refresh Token:', refreshToken);
        return accessToken;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        //const token = await signInAndGetToken('muktharamesh21@gmail.com', 'AthenaWarrior0212*')
        const token = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IncxQ0o4N1ZWbHdFWDE5Nk8iLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3ZqZGpybXVob2p3cHJ1Z3BwdWZkLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJhNWE5ODk4Yi05ZmNjLTQ5NmQtODg0ZS03YmQ1YmZlYzM5YzQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ4MjQxODM0LCJpYXQiOjE3NDgyMzgyMzQsImVtYWlsIjoibXVrdGhhcmFtZXNoMjFAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NDgyMzgyMzR9XSwic2Vzc2lvbl9pZCI6IjkwZDZhMjVlLTZmMzUtNDAzNy05OWZlLTkzMTg3MzNmNGI4MCIsImlzX2Fub255bW91cyI6ZmFsc2V9.KBcxya02Nohf8sIMbpRoaaZ8z9IJTrzJ5ovFnz8-c4g';
        console.log(yield verifyToken(token));
        console.log(jsonwebtoken_1.default.decode(token, { complete: true }));
    });
}
main();
