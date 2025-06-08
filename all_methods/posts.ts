import {createClient, SupabaseClient} from '@supabase/supabase-js'
import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'
import { Database, Tables, Enums } from '../databasetypes'
import {signInAndGetToken, signOut, getSupabaseClient, decodeToken, createUser, deleteAccount} from './auth'
import assert from 'assert'
import dotenv from 'dotenv';
import { get } from 'http'
import { create } from 'domain'
import {Post, Comment} from './utils.js'


//allows us to use process.env to get environment variables
dotenv.config();

//might not need
export function getBulkPostInfoById(post_ids: string[], databaseClient: SupabaseClient<Database>): Promise<Post[]> {
    throw new Error('Function not implemented.');

    return new Promise((resolve, reject) => {
        databaseClient
            .from('posts')
            .select('id, title, content, created_at, author_id, author:usersettings!author_id (username)')
            .in('id', post_ids)
            .then(({ data, error }: QueryResult<Tables['posts']>) => {
                if (error) {
                    console.error('Error fetching posts:', error.message);
                    reject(error);
                } else {
                    const posts = data.map(post => ({
                        id: post.id,
                        title: post.title,
                        content: post.content,
                        created_at: post.created_at,
                        author_id: post.author_id,
                        author_username: post.author?.username || ''
                    }));
                    resolve(posts);
                }
            });
    });
}

export async function likePost(postId: string, userId: string, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('post_likes')
        .insert({ post_id: postId, user_id: userId });

    if (error) {
        console.error('Error liking post:', error.message);
        throw error;
    }
}

export async function unlikePost(postId: string, userId: string, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

    if (error) {
        console.error('Error unliking post:', error.message);
        throw error;
    }
}

export async function getAllLikedPosts(userId: string, databaseClient: SupabaseClient<Database>): Promise<any[]> {
    const { data, error } = await databaseClient
        .from('post_likes')
        .select('post_id')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching liked posts:', error.message);
        throw error;
    }

    return data.map(like => like.post_id);
}

export async function savePost(postId: string, userId: string, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('saved_posts')
        .insert({ post_id: postId, user_id: userId });

    if (error) {
        console.error('Error saving post:', error.message);
        throw error;
    }
}

export async function unSavePost(postId: string, userId: string, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('saved_posts')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

    if (error) {
        console.error('Error unsaving post:', error.message);
        throw error;
    }
}

export async function inspiredByPost(postId: string, userId: string, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('inspired_posts')
        .insert({ post_id: postId, user_id: userId });

    if (error) {
        console.error('Error marking post as inspired:', error.message);
        throw error;
    }
}

export async function createPost(postDetails: { title: string; content: string; authorId: string }, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('posts')
        .insert(postDetails);

    if (error) {
        console.error('Error creating post:', error.message);
        throw error;
    }
}

export async function deletePost(postId: string, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('posts')
        .delete()
        .eq('id', postId);

    if (error) {
        console.error('Error deleting post:', error.message);
        throw error;
    }
}

export async function archivePost(postId: string, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('posts')
        .update({ archived: true })
        .eq('id', postId);

    if (error) {
        console.error('Error archiving post:', error.message);
        throw error;
    }
}

export async function unarchivePost(postId: string, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('posts')
        .update({ archived: false })
        .eq('id', postId);

    if (error) {
        console.error('Error unarchiving post:', error.message);
        throw error;
    }
}

export async function changeVTs(postId: string, viewershipTags: string[], databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('posts')
        .update({ viewership_tags: viewershipTags })
        .eq('id', postId);

    if (error) {
        console.error('Error changing viewership tags:', error.message);
        throw error;
    }
}

export async function changeCategories(postId: string, categories: string[], databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('posts')
        .update({ categories })
        .eq('id', postId);

    if (error) {
        console.error('Error changing categories:', error.message);
        throw error;
    }
}

export async function getFeed(userId: string, databaseClient: SupabaseClient<Database>): Promise<any[]> {
    const { data, error } = await databaseClient
        .rpc('get_feed', { user_id: userId });

    if (error) {
        console.error('Error fetching feed:', error.message);
        throw error;
    }

    return data;
}

export async function addCommentToPost(postId: string, commentDetails: { content: string; authorId: string }, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('comments')
        .insert({ post_id: postId, ...commentDetails });

    if (error) {
        console.error('Error adding comment to post:', error.message);
        throw error;
    }
}

export async function replyToComment(commentId: string, replyDetails: { content: string; authorId: string }, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('comment_replies')
        .insert({ comment_id: commentId, ...replyDetails });

    if (error) {
        console.error('Error replying to comment:', error.message);
        throw error;
    }
}