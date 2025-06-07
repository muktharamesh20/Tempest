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
function getFollowingListID(userId, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient
            .from('people_to_following')
            .select('followed_id')
            .eq('follower_id', userId);
        if (error) {
            console.error('Error fetching followers:', error.message);
            throw error;
        }
        return (data.map((following) => following.followed_id));
    });
}
function getFollowerListID(userId, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient
            .from('people_to_following')
            .select('follower_id')
            .eq('followed_id', userId);
        if (error) {
            console.error('Error fetching followers:', error.message);
            throw error;
        }
        return (data.map((following) => following.follower_id));
    });
}
function getFollowerListUserName(userId, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient
            .from('people_to_following')
            .select('usersettings!follower_id  (username)')
            .eq('followed_id', userId);
        if (error) {
            console.error('Error fetching followers:', error.message);
            throw error;
        }
        return (data.map((following) => following.usersettings.username).filter((username) => username !== null && username !== undefined));
    });
}
function getFollowingListUserName(userId, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient
            .from('people_to_following')
            .select('usersettings!followed_id  (username)')
            .eq('follower_id', userId);
        if (error) {
            console.error('Error fetching followers:', error.message);
            throw error;
        }
        return (data.map((following) => following.usersettings.username).filter((username) => username !== null && username !== undefined));
    });
}
function getPostsFromUser(userId, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient
            .from('post')
            .select('*')
            .eq('owner_id', userId);
        if (error) {
            console.error('Error fetching posts:', error.message);
            throw error;
        }
        console.log('Posts data:', data.map(post => (post.title)));
        return data.map(post => (post.id));
    });
}
//-----------------------------------------------------------------------------------------------------------//
function acceptFollowerRequest(requester_id, my_id, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient
            .from('people_to_following')
            .insert({ follower_id: requester_id, followed_id: my_id });
        if (error) {
            console.error('Error accepting follower request:', error.message);
            throw error;
        }
        console.log('Follower request accepted:', data);
    });
}
function rejectOrRevokeFollowerRequest(requester_id, followed_id, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient
            .from('follow_request')
            .delete()
            .match({ requester: requester_id, followed_id: followed_id });
        if (error) {
            console.error('Error rejecting follower request:', error.message);
            throw error;
        }
        console.log('Follower request rejected:', data);
    });
}
function createFollowerRequest(my_id, follower_id, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient
            .from('follow_request')
            .insert({ requester: my_id, followed_id: follower_id });
        if (error) {
            console.error('Error creating follower request:', error.message);
            throw error;
        }
        console.log('Follower request created:', data);
    });
}
//--------------------------------------------Group stuff---------------------------------------------------//
function createGroup(groupName, userId, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        //const { data, error } = await supabaseClient
        //  .from('group')
        //.insert({ name: groupName, owner_id: userId });
        throw new Error('Not implemented yet');
        //if (error) {
        //    console.error('Error creating group:', error.message);
        //    throw error;
        //}
        //console.log('Group created:', data);
    });
}
function transferOwnership(groupId, newOwnerId, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        //must only change one person's role to "owner"... you will automatically transform into a general member
    });
}
function changeOwnership(groupId, newOwnerId, newRole, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function requestJoinGroup(groupId, userId, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function inviteMemberToGroup(groupId, userId, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function acceptGroupInvite(groupId, userId, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        //Must create a join request
    });
}
function rejectGroupInvite(groupId, userId, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        //Must delete the invite request
    });
}
function rejectJoinRequest(groupId, userId, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        // Must delete the join request
    });
}
function deleteGroup(groupId, supabaseClient) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
//--------------------------------------------Main Function--------------------------------------------------//
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const user20 = '631fc63b-98d6-4434-a6b8-6c5c6d584069';
        const abc = '70f8a317-c06b-471b-a51c-4b61a5fc35fa';
        const another = 'a08d9256-23f9-426e-9e36-a53d504c92e0';
        const user21 = 'da2b0a4b-ca12-40a2-b6cd-aa08e64493cb';
        const onefinal = 'f4790ec6-eb7f-4190-b778-27909cafa49f';
        const supabase = yield (0, auth_1.getSupabaseClient)();
        let [token, refreshToken, user_id] = yield (0, auth_1.signInAndGetToken)('muktharamesh21@gmail.com', 'abcabc', supabase);
        yield getViewershipTag(supabase);
        console.log("User id:", user_id);
        //await createFollowerRequest(user_id, abc, supabase);
        //await rejectOrRevokeFollowerRequest(user_id, user20, supabase);
        //await acceptFollowerRequest(abc, user_id, supabase);
        console.log(yield getPostsFromUser(user20, supabase));
        (0, auth_1.signOut)(token, supabase);
    });
}
main();
