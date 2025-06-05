import {createClient, SupabaseClient} from '@supabase/supabase-js'
import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'
import { Database, Tables, Enums } from './databasetypes'
import {signInAndGetToken, signOut, getSupabaseClient, decodeToken} from './auth'
import assert from 'assert'
import dotenv from 'dotenv';
import { get } from 'http'

//allows us to use process.env to get environment variables
dotenv.config();

// Create a single supabase client for interacting with your database
/* const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? assert.fail('NEXT_PUBLIC_SUPABASE_URL is not defined'),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? assert.fail('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined'), {
        auth: {
          flowType: 'pkce',
          autoRefreshToken: false,
          persistSession: true,
          detectSessionInUrl: true
        }
      }) */

//helper functions to interact with the database
type friend = {
    followed_id: string;
    follower_id: string;
};


async function getViewershipTag(supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { data, error } = await supabaseClient
        .from('viewership_tags')
        .select('*');
    if (error) {
        console.error('Error fetching viewership tag:', error.message);
        throw error;
    }

    console.log('Viewership tag data:', data);
}

async function getFollowingListID( userId: string, supabaseClient: SupabaseClient<Database>): Promise<string[]> {
    const { data, error } = await supabaseClient
        .from('people_to_following')
        .select('followed_id')
        .eq('follower_id', userId);

    if (error) {
        console.error('Error fetching followers:', error.message);
        throw error;
    }

    return(data.map((following) => following.followed_id));
}

async function getFollowerListID( userId: string, supabaseClient: SupabaseClient<Database>): Promise<string[]> {
    const { data, error } = await supabaseClient
        .from('people_to_following')
        .select('follower_id')
        .eq('followed_id', userId);

    if (error) {
        console.error('Error fetching followers:', error.message);
        throw error;
    }

    return(data.map((following) => following.follower_id));
}

async function getFollowerListUserName( userId: string, supabaseClient: SupabaseClient<Database>): Promise<string[]> {
    const { data, error } = await supabaseClient
        .from('people_to_following')
        .select('usersettings!follower_id  (username)')
        .eq('followed_id', userId);

    if (error) {
        console.error('Error fetching followers:', error.message);
        throw error;
    }

    return(data.map((following) => following.usersettings.username).filter((username) => username !== null && username !== undefined));
}

async function getFollowingListUserName(userId: string, supabaseClient: SupabaseClient<Database>): Promise<string[]> {
    const { data, error } = await supabaseClient
        .from('people_to_following')
        .select('usersettings!followed_id  (username)')
        .eq('follower_id', userId);

    if (error) {
        console.error('Error fetching followers:', error.message);
        throw error;
    }

    return(data.map((following) => following.usersettings.username).filter((username) => username !== null && username !== undefined));
}


async function getPostsFromUser(userId: string, supabaseClient: SupabaseClient<Database>): Promise<string[]> {
    const { data, error } = await supabaseClient
        .from('post')
        .select('*')
        //.eq('owner_id', userId);

    if (error) {
        console.error('Error fetching posts:', error.message);
        throw error;
    }

    console.log('Posts data:', data.map(post => (post.title)));
    return data.map(post => (post.id));
}

//-----------------------------------------------------------------------------------------------------------//
async function acceptFollowerRequest(requester_id: string, my_id:string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { data, error } = await supabaseClient
        .from('people_to_following')
        .insert({ follower_id: requester_id, followed_id: my_id });

    if (error) {
        console.error('Error accepting follower request:', error.message);
        throw error;
    }

    console.log('Follower request accepted:', data);
}

async function rejectOrRevokeFollowerRequest(requester_id: string, followed_id:string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { data, error } = await supabaseClient
        .from('follow_request')
        .delete()
        .match({ requester: requester_id, followed_id: followed_id });

    if (error) {
        console.error('Error rejecting follower request:', error.message);
        throw error;
    }

    console.log('Follower request rejected:', data);
}

async function createFollowerRequest(my_id:string, follower_id: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { data, error } = await supabaseClient
        .from('follow_request')
        .insert({ requester: my_id, followed_id: follower_id });

    if (error) {
        console.error('Error creating follower request:', error.message);
        throw error;
    }

    console.log('Follower request created:', data);
}

//--------------------------------------------Main Function--------------------------------------------------//
async function main(): Promise<void> {
    const user20 = '631fc63b-98d6-4434-a6b8-6c5c6d584069';
    const abc = '70f8a317-c06b-471b-a51c-4b61a5fc35fa';
    const another = 'a08d9256-23f9-426e-9e36-a53d504c92e0';
    const user21 = 'da2b0a4b-ca12-40a2-b6cd-aa08e64493cb';
    const onefinal = 'f4790ec6-eb7f-4190-b778-27909cafa49f';
    const supabase = await getSupabaseClient();
    let [token, refreshToken, user_id] = await signInAndGetToken('abc@gmail.com', 'abcabc', supabase);
    await getViewershipTag(supabase);
    console.log("User id:", user_id);

    //await createFollowerRequest(user_id, abc, supabase);
    //await rejectOrRevokeFollowerRequest(user_id, user20, supabase);
    //await acceptFollowerRequest(abc, user_id, supabase);
    console.log(await getPostsFromUser(user_id, supabase));
    signOut(token, supabase);
}

main()