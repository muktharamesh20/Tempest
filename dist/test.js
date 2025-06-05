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
const auth_1 = require("./auth");
const dotenv_1 = __importDefault(require("dotenv"));
//allows us to use process.env to get environment variables
dotenv_1.default.config();
function getViewershipTag(supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient
            .from('viewership_tags')
            .select('*');
        if (error) {
            console.error('Error fetching viewership tag:', error.message);
            throw error;
        }
        console.log('Viewership tag data:', data);
    });
}
function getFollowedList(userId, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient
            .from('people_to_following')
            .select('*');
        //.eq('followed_id', userId);
        if (error) {
            console.error('Error fetching followers:', error.message);
            throw error;
        }
        return (data.map((following) => following.follower_id));
    });
}
function getFollowerList(userId, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient
            .from('people_to_following')
            .select('*');
        //.eq('follower_id', userId);
        if (error) {
            console.error('Error fetching followers:', error.message);
            throw error;
        }
        return (data.map((following) => following.followed_id));
    });
}
function getPostsFromUser(userId, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient
            .from('post')
            .select('*')
            .eq('user_id', userId);
        if (error) {
            console.error('Error fetching posts:', error.message);
            throw error;
        }
        console.log('Posts data:', data);
    });
}
//--------------------------------------------Main Function--------------------------------------------------//
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const supabase = yield (0, auth_1.getSupabaseClient)();
        let [token, refreshToken, user_id] = yield (0, auth_1.signInAndGetToken)('muktharamesh20@gmail.com', 'AthenaWarrior0212*', supabase);
        yield getViewershipTag(supabase);
        console.log("User id:", user_id);
        console.log('followers');
        console.log(yield getFollowerList(user_id, supabase));
        (0, auth_1.signOut)(token, supabase);
    });
}
main();
