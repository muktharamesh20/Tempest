import {createClient, SupabaseClient} from '@supabase/supabase-js'
import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'
import { Database, Tables, Enums } from '../databasetypes'
import {signInAndGetToken, signOut, getSupabaseClient, decodeToken, createUser, deleteAccount} from './auth'
import assert from 'assert'
import dotenv from 'dotenv';
import { get } from 'http'
import { create } from 'domain'

//allows us to use process.env to get environment variables
dotenv.config();

export async function createGroup(groupDetails: { name: string; description: string; profilePicture: string; ownerId: string }, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('groups')
        .insert(groupDetails);

    if (error) {
        console.error('Error creating group:', error.message);
        throw error;
    }
}

export async function deleteGroup(groupId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('groups')
        .delete()
        .eq('id', groupId);

    if (error) {
        console.error('Error deleting group:', error.message);
        throw error;
    }
}

export async function getGroupMembers(groupId: string, supabaseClient: SupabaseClient<Database>): Promise<any[]> {
    const { data, error } = await supabaseClient
        .from('group_members')
        .select('*')
        .eq('group_id', groupId);

    if (error) {
        console.error('Error fetching group members:', error.message);
        throw error;
    }

    return data;
}

export async function inviteMember(groupId: string, memberId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_invites')
        .insert({ group_id: groupId, member_id: memberId });

    if (error) {
        console.error('Error inviting member:', error.message);
        throw error;
    }
}

export async function removeMember(groupId: string, memberId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('member_id', memberId);

    if (error) {
        console.error('Error removing member:', error.message);
        throw error;
    }
}

export async function acceptInvite(groupId: string, memberId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_invites')
        .update({ accepted: true })
        .eq('group_id', groupId)
        .eq('member_id', memberId);

    if (error) {
        console.error('Error accepting invite:', error.message);
        throw error;
    }
}

export async function joinRequest(groupId: string, userId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_join_requests')
        .insert({ group_id: groupId, user_id: userId });

    if (error) {
        console.error('Error creating join request:', error.message);
        throw error;
    }
}

export async function acceptJoinRequest(groupId: string, userId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_join_requests')
        .update({ accepted: true })
        .eq('group_id', groupId)
        .eq('user_id', userId);

    if (error) {
        console.error('Error accepting join request:', error.message);
        throw error;
    }
}

export async function deleteJoinRequest(groupId: string, userId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_join_requests')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);

    if (error) {
        console.error('Error deleting join request:', error.message);
        throw error;
    }
}

export async function deleteInvite(groupId: string, memberId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_invites')
        .delete()
        .eq('group_id', groupId)
        .eq('member_id', memberId);

    if (error) {
        console.error('Error deleting invite:', error.message);
        throw error;
    }
}

export async function changeGroupName(groupId: string, newName: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('groups')
        .update({ name: newName })
        .eq('id', groupId);

    if (error) {
        console.error('Error changing group name:', error.message);
        throw error;
    }
}

export async function changeGroupDescription(groupId: string, newDescription: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('groups')
        .update({ description: newDescription })
        .eq('id', groupId);

    if (error) {
        console.error('Error changing group description:', error.message);
        throw error;
    }
}

export async function changeGroupProfilePicture(groupId: string, newProfilePicture: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('groups')
        .update({ profile_picture: newProfilePicture })
        .eq('id', groupId);

    if (error) {
        console.error('Error changing group profile picture:', error.message);
        throw error;
    }
}

export async function deleteGroupProfilePicture(groupId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('groups')
        .update({ profile_picture: null })
        .eq('id', groupId);

    if (error) {
        console.error('Error deleting group profile picture:', error.message);
        throw error;
    }
}

export async function createGroupEvent(eventDetails: { title: string; description: string; date: string; groupId: string }, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_events')
        .insert(eventDetails);

    if (error) {
        console.error('Error creating group event:', error.message);
        throw error;
    }
}

export async function deleteGroupEvent(eventId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_events')
        .delete()
        .eq('id', eventId);

    if (error) {
        console.error('Error deleting group event:', error.message);
        throw error;
    }
}

export async function assignGroupTodo(todoDetails: { title: string; description: string; dueDate: string; groupId: string }, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_todos')
        .insert(todoDetails);

    if (error) {
        console.error('Error assigning group todo:', error.message);
        throw error;
    }
}

export async function deleteGroupTodo(todoId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_todos')
        .delete()
        .eq('id', todoId);

    if (error) {
        console.error('Error deleting group todo:', error.message);
        throw error;
    }
}

export async function messageGroup(groupId: string, message: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_messages')
        .insert({ group_id: groupId, message });

    if (error) {
        console.error('Error messaging group:', error.message);
        throw error;
    }
}

export async function getAllMessages(groupId: string, supabaseClient: SupabaseClient<Database>): Promise<any[]> {
    const { data, error } = await supabaseClient
        .from('group_messages')
        .select('*')
        .eq('group_id', groupId);

    if (error) {
        console.error('Error fetching group messages:', error.message);
        throw error;
    }

    return data;
}

export async function postGroupMessage(groupId: string, messageDetails: { message: string; senderId: string }, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_messages')
        .insert({ group_id: groupId, ...messageDetails });

    if (error) {
        console.error('Error posting group message:', error.message);
        throw error;
    }
}

export async function getGroupProfilePagePostsAndCategories(groupId: string, supabaseClient: SupabaseClient<Database>): Promise<any[]> {
    const { data, error } = await supabaseClient
        .from('group_profile_page')
        .select('*')
        .eq('group_id', groupId);

    if (error) {
        console.error('Error fetching group profile page posts and categories:', error.message);
        throw error;
    }

    return data;
}

export async function editGroupTodo(todoId: string, updatedDetails: object, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_todos')
        .update(updatedDetails)
        .eq('id', todoId);

    if (error) {
        console.error('Error editing group todo:', error.message);
        throw error;
    }
}

export async function editGroupEvent(eventId: string, updatedDetails: object, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_events')
        .update(updatedDetails)
        .eq('id', eventId);

    if (error) {
        console.error('Error editing group event:', error.message);
        throw error;
    }
}

export async function transferOwnership(groupId: string, newOwnerId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('groups')
        .update({ owner_id: newOwnerId })
        .eq('id', groupId);

    if (error) {
        console.error('Error transferring ownership:', error.message);
        throw error;
    }
}

export async function changeRoleOf(groupId: string, memberId: string, newRole: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_members')
        .update({ role: newRole })
        .eq('group_id', groupId)
        .eq('member_id', memberId);

    if (error) {
        console.error('Error changing role of member:', error.message);
        throw error;
    }
}

export async function leaveGroup(groupId: string, userId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('member_id', userId);

    if (error) {
        console.error('Error leaving group:', error.message);
        throw error;
    }
}

export async function viewGroupCalendar(groupId: string, supabaseClient: SupabaseClient<Database>): Promise<any[]> {
    const { data, error } = await supabaseClient
        .from('group_calendar')
        .select('*')
        .eq('group_id', groupId);

    if (error) {
        console.error('Error viewing group calendar:', error.message);
        throw error;
    }

    return data;
}