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
function addRecord(table, record) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabase.from(table).insert(record);
        if (error) {
            throw new Error(`Error adding record to ${table}: ${error.message}`);
        }
        console.log(`Record added to ${table}:`, data);
    });
}
//--------------------------------------------Main Function--------------------------------------------------//
function main() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
main();
