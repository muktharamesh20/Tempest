import {createClient, SupabaseClient} from '@supabase/supabase-js'
import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'
import { Database, Tables, Enums } from '../databasetypes'
import {signInAndGetToken, signOut, getSupabaseClient, decodeToken, createUser, deleteAccount} from './auth'
import assert from 'assert'
import dotenv from 'dotenv';
import { get } from 'http'
import { create } from 'domain'
import {Post, Comment} from './utils.js'
import {getBulkPostInfoById} from './posts.js'

//allows us to use process.env to get environment variables
dotenv.config();

/**
 * This function retrieves all the people that a user follows.
 * 
 * @param userId the user to check
 * @param supabaseClient the database client to use
 * @returns All the poeple that userId follows, with their id and username.
 */
export async function getFollowsThesePeople( userId: string, supabaseClient: SupabaseClient<Database>): Promise<{id: string, username:string}[]> {
    const { data, error } = await supabaseClient
        .from('people_to_following')
        .select('followed_id, usersettings!followed_id (username)')
        .eq('follower_id', userId);

    if (error) {
        console.error('Error fetching followers:', error.message);
        throw error;
    }

    return data
        .filter((following) => following.usersettings?.username !== null)
        .map((following) => ({
            id: following.followed_id,
            username: following.usersettings!.username as string
        }));
}

/**
 * This function retrieves all the people that follow a user.
 * 
 * @param userId the user to check
 * @param supabaseClient the database client to use
 * @returns All the people that follow userId, with their id and username.
 */
export async function getFollowedByThesePeople(userId: string, supabaseClient: SupabaseClient<Database>):  Promise<{id: string, username:string}[]> {
    const { data, error } = await supabaseClient
        .from('people_to_following')
        .select('follower_id, usersettings!follower_id (username)')
        .eq('followed_id', userId);

    if (error) {
        console.error('Error fetching followers:', error.message);
        throw error;
    }

    return  data
    .filter((following) => following.usersettings?.username !== null)
    .map((following) => ({
        id: following.follower_id,
        username: following.usersettings!.username as string
    }));
}

export async function getHomePagePostsAndCategories(userId: string, supabaseClient: SupabaseClient<Database>): Promise<{categoryName: string, orderNum: number, posts: string[]}> {
    const posts = getAllPostsBy(userId, supabaseClient)

    throw new Error('Function not implemented.'); // This function is not fully implemented yet, so we throw an error for now.
}

export async function getAllPostsBy(userId: string, supabaseClient: SupabaseClient<Database>): Promise<Post[]> {
    const { data, error } = await supabaseClient
        .from('post')
        .select('*')
        .eq('owner_id', userId);

    if (error) {
        console.error('Error fetching posts:', error.message);
        throw error;
    }

    // Get the post ids
    const postIds = data.map(post => post.id);

    // Get the bulk post info by id
    return getBulkPostInfoById(postIds, supabaseClient);
}

export async function getAllMessagesBetween(userId1: string, userId2: string, supabaseClient: SupabaseClient<Database>): Promise<{id: string, content: string, created_at: Date, sender_id: string}[]> {
    throw new Error('Function not implemented.'); // This function is not fully implemented yet, so we throw an error for now.
    const { data, error } = await supabaseClient
        .from('messages')
        .select('*')
        .or(`(sender_id.eq.${userId1},sender_id.eq.${userId2})`)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching messages:', error.message);
        throw error;
    }

    return data;
}

export async function postMessage(content: string, senderId: string, receiverId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    throw new Error('Function not implemented.'); // This function is not fully implemented yet, so we throw an error for now.
    const { data, error } = await supabaseClient
        .from('messages')
        .insert({ content, sender_id: senderId, receiver_id: receiverId });

    if (error) {
        console.error('Error posting message:', error.message);
        throw error;
    }

    console.log('Message posted successfully:', data);
}

export async function deleteMessage(messageId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    throw new Error('Function not implemented.'); // This function is not fully implemented yet, so we throw an error for now.
    const { data, error } = await supabaseClient
        .from('messages')
        .delete()
        .eq('id', messageId);

    if (error) {
        console.error('Error deleting message:', error.message);
        throw error;
    }

    console.log('Message deleted successfully:', data);
}

export async function getTaggedPostsFrom(userId: string, supabaseClient: SupabaseClient<Database>): Promise<Post[]> {
    throw new Error('Function not implemented.'); // This function is not fully implemented yet, so we throw an error for now.
    const { data, error } = await supabaseClient
        .from('post_tags')
        .select('post_id')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching tagged posts:', error.message);
        throw error;
    }

    const postIds = data.map(tag => tag.post_id);
    return getBulkPostInfoById(postIds, supabaseClient);
}

export async function toggleCloseFrined(userId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    throw new Error('Function not implemented.'); // This function is not fully implemented yet, so we throw an error for now.
    const { data, error } = await supabaseClient
        .from('usersettings')
        .select('id, username, email')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user info:', error.message);
        throw error;
    }

    return {
        id: data.id,
        username: data.username,
        email: data.email
    };
}

export async function getAllCloseFriends(userId: string, supabaseClient: SupabaseClient<Database>): Promise<{id: string, username: string}[]> {
    throw new Error('Function not implemented.'); // This function is not fully implemented yet, so we throw an error for now.
    const { data, error } = await supabaseClient
        .from('close_friends')
        .select('friend_id, usersettings!friend_id (username)')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching close friends:', error.message);
        throw error;
    }

    return data
        .filter((friend) => friend.usersettings?.username !== null)
        .map((friend) => ({
            id: friend.friend_id,
            username: friend.usersettings!.username as string
        }));
}

export async function viewCalendarOf(userId: string, supabaseClient: SupabaseClient<Database>): Calendar {
    throw new Error('Function not implemented.'); // This function is not fully implemented yet, so we throw an error for now.
    const { data, error } = await supabaseClient
        .from('calendar_events')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching calendar events:', error.message);
        throw error;
    }

    return data.map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end)
    }));
}