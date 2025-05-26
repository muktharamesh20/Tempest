"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const assert_1 = __importDefault(require("assert"));
const supabase = (0, supabase_js_1.createClient)((_a = process.env.NEXT_PUBLIC_SUPABASE_URL) !== null && _a !== void 0 ? _a : assert_1.default.fail(), (_b = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) !== null && _b !== void 0 ? _b : assert_1.default.fail(), {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    }
});
