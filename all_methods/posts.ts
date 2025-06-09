import {createClient, SupabaseClient} from '@supabase/supabase-js'
import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'
import { Database, Tables, Enums } from '../databasetypes'
import {signInAndGetToken, signOut, getSupabaseClient, decodeToken, createUser, deleteAccount} from './auth'
import assert from 'assert'
import dotenv from 'dotenv';
import { get } from 'http'
import { create } from 'domain'
import * as types from './utils.js'


//allows us to use process.env to get environment variables
dotenv.config();


export async function likePost(post: types.Post, user: types.User, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('people_to_liked')
        .insert({ post_id: post.id, person_id: user.user_id });

    if (error) {
        console.error('Error liking post:', error.message);
        throw error;
    }
}

export async function unlikePost(post: types.Post, user: types.User, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('people_to_liked')
        .delete()
        .eq('post_id', post.id)
        .eq('user_id', user.user_id );

    if (error) {
        console.error('Error unliking post:', error.message);
        throw error;
    }
}

export async function getAllLikedPosts(user: types.User, databaseClient: SupabaseClient<Database>): Promise<types.Post[]> {
    const { data, error } = await databaseClient
        .from('people_to_liked')
        .select('post_id, post!post_id (*)')
        .eq('user_id', user.user_id);

    if (error) {
        console.error('Error fetching liked posts:', error.message);
        throw error;
    }

    return await Promise.all(data.map(record => types.createPostTypeWithData(record.post)));
}

export async function savePost(post: types.Post, user: types.User, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('people_to_saved')
        .insert({ post_id: post.id, person_id: user.user_id });

    if (error) {
        console.error('Error saving post:', error.message);
        throw error;
    }
}

export async function unSavePost(post: types.Post, user: types.User, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('people_to_saved')
        .delete()
        .eq('post_id', post.id)
        .eq('user_id', user.user_id );

    if (error) {
        console.error('Error unsaving post:', error.message);
        throw error;
    }
}

export async function getAllSavedPosts(user: types.User, databaseClient: SupabaseClient<Database>): Promise<types.Post[]> {
    const { data, error } = await databaseClient
        .from('people_to_saved')
        .select('post_id, post!post_id (*)')
        .eq('user_id', user.user_id);

    if (error) {
        console.error('Error fetching saved posts:', error.message);
        throw error;
    }

    return await Promise.all(data.map(record => types.createPostTypeWithData(record.post)));
}

/**
 * Marks a post as inspired by incrementing the inspired_by_count in the database.
 * 
 * @param post the post to mark as inspired
 * @param databaseClient the Supabase client to use for the database operations
 */
export async function inspiredByPost(post: types.Post, databaseClient: SupabaseClient<Database>): Promise<void> {
    const {data, error} = await databaseClient.rpc('increment_inspired_by_count', {p_post_id: post.id});

    if (error) {
        console.error('Error marking post as inspired:', error.message);
        throw error;
    }
}

/**
 * This function creates a new post in the database.
 * 
 * @param postDetails the details of the post to create, including title, content, and authorId
 * @param databaseClient the Supabase client to use for the database operations
 */
export async function createPost(postDetails: { title: string; content: string; authorId: string }, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('posts')
        .insert(postDetails);

    if (error) {
        console.error('Error creating post:', error.message);
        throw error;
    }
}

export async function deletePost(post: types.Post, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('posts')
        .delete()
        .eq('id', post.id);

    if (error) {
        console.error('Error deleting post:', error.message);
        throw error;
    }
}

/**
 *  Archives a post. Requires that you own the post, and it's not already archived
 * 
 * @param post the post to archive
 * @param databaseClient the Supabase client to use for the database operations
 */
export async function archivePost(post: types.Post, databaseClient: SupabaseClient<Database>): Promise<types.Post> {
    const { data, error } = await databaseClient
        .from('post_to_viewership_tags')
        .insert({ post_id: post.id, vt_id: '3f60393f-ac00-475b-a27c-4f906ae5497f' }).select('post_id, post!post_id (*)');

    if (error) {
        console.error('Error archiving post:', error.message);
        throw error;
    }

    return post;
}

/**
 * Unarchives a post. Requires that you own the post, and it's already archived
 * 
 * @param post the post to unarchive
 * @param databaseClient the Supabase client to use for the database operations
 * @returns the unarchived post
 */
export async function unarchivePost(post: types.Post, databaseClient: SupabaseClient<Database>): Promise<types.Post> {
    const { data, error } = await databaseClient
    .from('post_to_viewership_tags')
    .delete()
    .eq('post_id', post.id)
    .eq('vt_id', '3f60393f-ac00-475b-a27c-4f906ae5497f')
    .select('post_id, post!post_id (*)');

    if (error) {
        console.error('Error archiving post:', error.message);
        throw error;
    }

    return post;
}

/**
 * the function retrieves the viewership tags of a post.  Requires that you own the post.
 * 
 * @param post the post to get the viewership tags for
 * @param databaseClient the Supabase client to use for the database operations
 * @returns the viewership tags of the post
 */
export async function getViewershipTagsOfMyPost(post: types.Post, databaseClient: SupabaseClient<Database>): Promise<types.ViewershipTag[]> {
    const { data, error } = await databaseClient
        .from('post_to_viewership_tags')
        .select('vt_id')
        .eq('post_id', post.id);

    if (error) {
        console.error('Error fetching viewership tags of post:', error.message);
        throw error;
    }

    const data2 = data;
    let result: types.ViewershipTag[] = [];

    if (data) {
        const { data, error } = await databaseClient
            .from('viewership_tags')
            .select('*')
            .in('id', data2.map(record => record.vt_id));

        if (error) {
            console.error('Error fetching viewership tags:', error.message);
            throw error;
        }

        result = await Promise.all(data?.map(record => types.createViewershipTagTypeWithData(record)) || []);
    }

    return result;
}

export async function createViewershipTag(me: types.User, tag_name: string, color: string, users_to_add: types.User[],description: string, databaseClient: SupabaseClient<Database>): Promise<types.ViewershipTag> {
    const { data, error } = await databaseClient
        .from('viewership_tags')
        .insert({ owner_id: me.user_id, tag_color: color, tag_name: tag_name })
        .select('*')
        .single();

    if (error) {
        console.error('Error creating viewership tag:', error.message);
        throw error;
    }
    const vt = await types.createViewershipTagTypeWithData(data);
    changeViewershipTagMembers(me, vt, users_to_add, [], databaseClient);

    return vt;
}

export async function deleteViewershipTag(vt: types.ViewershipTag, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('viewership_tags')
        .delete()
        .eq('id', vt.id);

    if (error) {
        console.error('Error deleting viewership tag:', error.message);
        throw error;
    }
}

export async function changeViewershipTagMembers(me: types.User, vt: types.ViewershipTag, users_to_add: types.User[], users_to_remove: types.User[], databaseClient: SupabaseClient<Database>): Promise<void> {
    // Remove users from the viewership tag
    if (users_to_remove.length > 0) {
        const { error: removeError } = await databaseClient
            .from('people_to_viewership_tag')
            .delete()
            .in('person_associated', users_to_remove.map(user => user.user_id))
            .eq('vt_id', vt.id)
            .eq('owner_id', me.user_id);

        if (removeError) {
            console.error('Error removing users from viewership tag:', removeError.message);
            throw removeError;
        }
    }

    // Add new users to the viewership tag
    if (users_to_add.length > 0) {
        const { error: addError } = await databaseClient
            .from('people_to_viewership_tag')
            .insert(users_to_add.map(user => ({ viewership_tag: vt.id, person_associated: user.user_id, owner_id: me.user_id })));

        if (addError) {
            console.error('Error adding users to viewership tag:', addError.message);
            throw addError;
        }
    }
}

export async function getAllViewershipTags(databaseClient: SupabaseClient<Database>): Promise<types.ViewershipTag[]> {
    const { data, error } = await databaseClient
        .from('viewership_tags')
        .select('*');

    if (error) {
        console.error('Error fetching viewership tags:', error.message);
        throw error;
    }

    return await Promise.all(data.map(record => types.createViewershipTagTypeWithData(record)));
}



export async function changeVTsOfPost(post: types.Post, newViewershipTags: types.ViewershipTag[], databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error: deleteError } = await databaseClient
        .from('post_to_viewership_tags')
        .delete()
        .eq('post_id', post.id);

    const { data, error: insertError } = await databaseClient
        .from('post_to_viewership_tags')
        .insert(newViewershipTags.map(tag => ({ post_id: post.id, vt_id: tag.id })));

    if (insertError) {
        console.error('Error changing viewership tags:', insertError.message);
        throw insertError;
    }
}

export async function changeCategoriesOfPost(post: types.Post, categories: string[], databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('posts')
        .update({ categories })
        .eq('id', post.id);

    if (error) {
        console.error('Error changing categories:', error.message);
        throw error;
    }
}

export async function changeCategoriesOfTodo(todo: types.Todo, categories: string[], databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('todos')
        .update({ categories })
        .eq('id', todo.id);

    if (error) {
        console.error('Error changing categories:', error.message);
        throw error;
    }
}

export async function changeDisplayedCategoriesInProfile(user: types.User, categories: types.Category[], databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('usersettings')
        .update({ displayed_categories: categories })
        .eq('id', user.user_id);

    if (error) {
        console.error('Error changing displayed categories in profile:', error.message);
        throw error;
    }
} 

export async function getFeed(user: types.User, databaseClient: SupabaseClient<Database>): Promise<any[]> {
    const { data, error } = await databaseClient
        .rpc('get_feed', { user_id: user.user_id });

    if (error) {
        console.error('Error fetching feed:', error.message);
        throw error;
    }

    return data;
}

export async function addCommentToPost(post: types.Post, commentDetails: { content: string; authorId: string }, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('comments')
        .insert({ post_id: post.id, ...commentDetails });

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

/**
 * Highlights a post so it appears prominently in the user's profile.
 * 
 * @param post the post to highlight
 * @param databaseClient the database client to use for the database operations
 */
export async function highlightPost(post: types.Post, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('post')
        .update({ highlighted_by_owner: true })
        .eq('id', post.id);

    if (error) {
        console.error('Error highlighting post:', error.message);
        throw error;
    }
}

/**
 * Unhighlights a post.
 * 
 * @param post the post to unhighlight
 * @param databaseClient the Supabase client to use for the database operations
 */
export async function unHighlightPost(post: types.Post, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('post')
        .update({ highlighted_by_owner: false })
        .eq('id', post.id);

    if (error) {
        console.error('Error highlighting post:', error.message);
        throw error;
    }
}