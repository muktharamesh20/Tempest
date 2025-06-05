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


async function getPostsFromUser(
    userId: string,
    supabaseClient: SupabaseClient<Database>
): Promise<void> {
    const { data, error } = await supabaseClient
        .from('post')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching posts:', error.message);
        throw error;
    }

    console.log('Posts data:', data);
}

//--------------------------------------------Main Function--------------------------------------------------//
async function main(): Promise<void> {
    const supabase = await getSupabaseClient();
    let [token, refreshToken, user_id] = await signInAndGetToken('abc@gmail.com', 'abcabc', supabase);
    await getViewershipTag(supabase);
    console.log("User id:", user_id);
    user_id = 'f4790ec6-eb7f-4190-b778-27909cafa49f'
    console.log('followers')
    console.log(await getFollowerListUserName(user_id, supabase));
    signOut(token, supabase);
}

main()