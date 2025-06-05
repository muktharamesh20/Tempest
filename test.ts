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

async function getFollowedList( userId: string, supabaseClient: SupabaseClient<Database>): Promise<string[]> {
    const { data, error } = await supabaseClient
        .from('people_to_following')
        .select('*')
        //.eq('followed_id', userId);

    if (error) {
        console.error('Error fetching followers:', error.message);
        throw error;
    }

    return(data.map((following: friend) => following.follower_id));
}

async function getFollowerList( userId: string, supabaseClient: SupabaseClient<Database>): Promise<string[]> {
    const { data, error } = await supabaseClient
        .from('people_to_following')
        .select('*')
        //.eq('follower_id', userId);

    if (error) {
        console.error('Error fetching followers:', error.message);
        throw error;
    }

    return(data.map((following: friend) => following.followed_id));
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
    let [token, refreshToken, user_id] = await signInAndGetToken('muktharamesh20@gmail.com', 'AthenaWarrior0212*', supabase);
    await getViewershipTag(supabase);
    console.log("User id:", user_id);
    console.log('followers')
    console.log(await getFollowerList(user_id, supabase));
    signOut(token, supabase);
}

main()