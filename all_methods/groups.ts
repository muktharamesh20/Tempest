import {createClient, SupabaseClient} from '@supabase/supabase-js'
import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'
import { Database, Tables, Enums } from '../databasetypes'
import {signInAndGetToken, signOut, getSupabaseClient, decodeToken, createUser, deleteAccount} from './auth'
import assert from 'assert'
import dotenv from 'dotenv';
import { get } from 'http'
import { create } from 'domain'
import * as types from './utils.js'
import { NotImplementedError, getBatchUsers, createGroupTypeWithData } from './utils.js';
import { group } from 'console'
import { DateTime } from 'neo4j-driver'

//allows us to use process.env to get environment variables
dotenv.config();

/**
 * Creates a new group with the provided details, and returns the group's home page.
 * 
 * @param groupDetails 
 * @param supabaseClient 
 * @return A promise that resolves to the created group's home page.
 */
export async function createGroup(groupDetails: { name: string; description: types.Text; profilePicture: types.ProfilePicture | types.DefaultProfilePicture, public_special_events: boolean, title: string }, supabaseClient: SupabaseClient<Database>): Promise<types.GroupHomePage> {
    const { data, error } = await supabaseClient
        .from('groups')
        .insert(groupDetails)
        .select('group_id');

    if (error) {
        console.error('Error creating group:', error.message);
        throw error;
    }
    
    return getGroupFullProfilePage(data[0].group_id, supabaseClient);
}

/**
 * Deletes a group by its ID.  User must be the owner to delete the group.
 * 
 * @param group the group to delete 
 * @param supabaseClient
 * @throws Will throw an error if the deletion fails.
 */
export async function deleteGroup(group: types.Group, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('groups')
        .delete()
        .eq('group_id', group.group_id);

    if (error) {
        console.error('Error deleting group:', error.message);
        throw error;
    }
}

/**
 * Fetches the members of a group by its ID.
 * 
 * @param group 
 * @param supabaseClient 
 * @returns A list of users and their roles in the group.
 */
export async function getGroupMembers(group: types.Group, supabaseClient: SupabaseClient<Database>): Promise<types.GroupUserList> {
    const { data, error } = await supabaseClient
        .from('people_to_group')
        .select('*')
        .eq('group_id', group.group_id);

    if (error) {
        console.error('Error fetching group members:', error.message);
        throw error;
    }

    const peopleIds: types.UserId[] = [];
    const roles: types.Role[] = [];

    for(const member of data) {
        peopleIds.push(member.person_id as types.UserId);
        roles.push(member.role as types.Role);
    }

    const result = [];
    const userList = await getBatchUsers(peopleIds, supabaseClient);
    for (let i = 0; i < userList.length; i++) {
        result.push({user: userList[i], role: roles[i], group: group});
    }

    return result;
}

/**
 * Creates an invite for a member to join a group. You must be have permission to invite members to the group,
 * must be in the group, and the member must not already be in the group.
 * 
 * @param group tthe group to invite the member to.
 * @param member the member to invite.
 * @param supabaseClient the Supabase client to use for the database operations.
 */
export async function inviteMember(group: types.Group, member: types.User, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('invite_request')
        .insert({ group_id: group.group_id, user_to_invite: member.user_id });

    if (error) {
        console.error('Error inviting member:', error.message);
        throw error;
    }
}

/**
 * Removes a member from a group. You must be removing yourself, be an admin removing a genral member, 
 * or be the owner of the group and removing anyone except yourself (you must transfer ownership or delete
 * the group first).
 * 
 * @param group the group from which to remove the member. 
 * @param memberId the member to remove
 * @param supabaseClient 
 */
export async function removeMember(group: types.Group, member: types.User, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('people_to_group')
        .delete()
        .eq('group_id', group.group_id)
        .eq('member_id', member.user_id);

    if (error) {
        console.error('Error removing member:', error.message);
        throw new Error('Incorrect permissions');
    }
}

/**
 * When invited to a group, this function is called to accept the invite. Must be called by the invited
 * member, and the member must not already be in the group.  If no invitation exists, a join request will be created instead.
 * 
 * @param group the group to join
 * @param supabaseClient 
 */
export async function acceptInvite(group: types.Group, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('join_request')
        .insert({ group_id: group.group_id });

    if (error) {
        console.error('Error accepting invite:', error.message);
        throw error;
    }
}

/**
 * Creates a join request to join a group.  
 * 
 * @param group the group to join
 * @param supabaseClient 
 */
export async function joinRequest(group: types.Group, user: types.User, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('join_request')
        .insert({ group_id: group.group_id });

    if (error) {
        console.error('Error creating join request:', error.message);
        throw error;
    }
}

/**
 * Accepts a join request for a group.  Requires that the accepter is a member of the group and has
 * permission to accept join requests.  The user must not already be in the group, and must have already created
 * a join request.
 * 
 * @param group the group to accept the join request for
 * @param user the user you are accepting
 * @param supabaseClient 
 */
export async function acceptJoinRequest(group: types.Group, user: types.User, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('invite_request')
        .update({ group_id: group.group_id, user_to_invite: user.user_id })

    if (error) {
        console.error('Error accepting join request:', error.message);
        throw error;
    }
}

/**
 * Deletes a join request for a group.  Requires that the deleter is a member of the group and has
 * permission to accept and delete join requests, or that the user that created the join request is deleting it.
 * 
 * @param group group to delete the join request for
 * @param userId the user whose join request to delete
 * @param supabaseClient the Supabase client to use for the database operations.
 * @throws Will throw an error if the deletion fails, most likely due to permissions.
 */
export async function deleteJoinRequest(group: types.Group, user: types.User, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('join_request')
        .delete()
        .eq('group_id', group.group_id)
        .eq('person_id', user.user_id);

    if (error) {
        console.error('Error deleting join request:', error.message);
        throw error;
    }
}

/**
 * Deletes an invite for a member to join a group.  Requires that the deleter is the user that created the invite.
 * 
 * @param group the group to delete the invite for
 * @param user the member whose invite to delete
 * @param groupMemberId the user that created the invite, the deleter
 * @param supabaseClient the Supabase client to use for the database operations.
 * @throws Will throw an error if the deletion fails, most likely due to permissions.
 */
export async function deleteSpecificInvite(group: types.Group, user: types.User, groupMemberId: types.User, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('invite_request')
        .delete()
        .eq('group_id', group.group_id)
        .eq('user_to_invite', user.user_id )
        .eq('requester', groupMemberId.user_id);

    if (error) {
        console.error('Error deleting invite:', error.message);
        throw error;
    }
}

/**
 * Deletes all invite for a member to join a specific group.  Requires that the deleter is the user that was invited.
 * 
 * @param group the group to delete the invite for
 * @param deleter the user that is deleting the invite
 * @param supabaseClient the Supabase client to use for the database operations.
 * @throws Will throw an error if the deletion fails, most likely due to permissions.
 */
export async function deleteAllInvitesFromGroup(group: types.Group, deleter: types.User, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('invite_request')
        .delete()
        .eq('group_id', group.group_id)
        .eq('user_to_invite', deleter.user_id);

    if (error) {
        console.error('Error deleting invite:', error.message);
        throw error;
    }
}


/**
 * Changes the group name.  Requires the user is the owner of the group or has permission to change the group name.
 * 
 * @param group the group whose name you want to change
 * @param newName New group name
 * @param supabaseClient the Supabase client to use for the database operations.
 */
export async function changeGroupName(group: types.Group, newName: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('groups')
        .update({ title: newName })
        .eq('id', group.group_id);

    if (error) {
        console.error('Error changing group name:', error.message);
        throw error;
    }
}

/**
 * Changes the group description.  Requires the user is the owner of the group or has permission to change the group description.  Description must be under 300 characters.
 * 
 * @param group The ID of the group whose description you want to change
 * @param newDescription New group description
 * @param supabaseClient the Supabase client to use for the database operations.
 */
export async function changeGroupDescription(group: types.Group, newDescription: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('groups')
        .update({ description: newDescription })
        .eq('id', group.group_id);

    if (error) {
        console.error('Error changing group description:', error.message);
        throw error;
    }
}

/**
 * Uploads a new profile picture for the group. Requires user is a member of the group and has permission to change the profile picture.
 * 
 * @param group the group whose profile picture you want to upload
 * @param image the image to upload
 * @param supabaseClient the Supabase client to use for the database operations.
 */
export async function changeGroupProfilePicture(group: types.Group, newProfilePicture: types.Image, supabaseClient: SupabaseClient<Database>): Promise<void> {
    throw new NotImplementedError('changeGroupProfilePicture');
}

/**
 * Deletes the profile picture the group. Requires user is a member of the group and has permission to change the profile picture.
 * 
 * @param group the group whose profile picture you want to delete
 * @param supabaseClient the Supabase client to use for the database operations.
 */
export async function deleteGroupProfilePicture(group: types.Group, supabaseClient: SupabaseClient<Database>): Promise<void> {
    throw new NotImplementedError('deleteGroupProfilePicture');
}

/**
 * Creates a group event with the provided details. Requires user is a member of the group and has permission to create events.  Title must be under 20 characters, description under 300 characters.
 * 
 * @param eventDetails the details of the event to create, including title, description, date, and group.
 * @param supabaseClient the Supabase client to use for the database operations.
 */
export async function createGroupEvent(eventDetails: {title: string, description: string, location: string | null, start_time: DateTime, end_time: DateTime, is_all_day: boolean, start_date: Date, end_date: Date, repeat_period: types.RepeatPeriod, repeat_days: types.Day[], end_repeat: Date, special_event: boolean, working_on_todo: types.Todo, group: types.Group}, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('event')
        .insert({title: eventDetails.title,
                description: eventDetails.description,
                location: eventDetails.location,
                start_time: eventDetails.start_time,
                end_time: eventDetails.end_time,
                is_all_day: eventDetails.is_all_day,
                start_date: eventDetails.start_date,
                end_date: eventDetails.end_date,
                repeat_period: eventDetails.repeat_period,
                repeat_days: eventDetails.repeat_days,
                end_repeat: eventDetails.end_repeat,
                special_event: eventDetails.special_event,
                working_on_todo_id: eventDetails.working_on_todo.todo_id,
                group_id: eventDetails.group.group_id
        });

    if (error) {
        console.error('Error creating group event:', error.message);
        throw error;
    }
}

export async function deleteGroupEvent(eventId: string, group: types.Group, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_events')
        .delete()
        .eq('id', eventId)
        .eq('group_id', group.group_id);

    if (error) {
        console.error('Error deleting group event:', error.message);
        throw error;
    }
}

export async function assignGroupTodo(todoDetails: { title: string; description: string; dueDate: string; group: types.Group }, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_todos')
        .insert({ ...todoDetails, group_id: todoDetails.group.group_id });

    if (error) {
        console.error('Error assigning group todo:', error.message);
        throw error;
    }
}

export async function deleteGroupTodo(todoId: string, group: types.Group, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_todos')
        .delete()
        .eq('id', todoId)
        .eq('group_id', group.group_id);

    if (error) {
        console.error('Error deleting group todo:', error.message);
        throw error;
    }
}

export async function messageGroup(group: types.Group, message: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_messages')
        .insert({ group_id: group.group_id, message });

    if (error) {
        console.error('Error messaging group:', error.message);
        throw error;
    }
}

export async function getAllMessages(group: types.Group, supabaseClient: SupabaseClient<Database>): Promise<any[]> {
    const { data, error } = await supabaseClient
        .from('group_messages')
        .select('*')
        .eq('group_id', group.group_id);

    if (error) {
        console.error('Error fetching group messages:', error.message);
        throw error;
    }

    return data;
}

export async function postGroupMessage(group: types.Group, messageDetails: { message: string; sender: types.User }, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_messages')
        .insert({ group_id: group.group_id, sender_id: messageDetails.sender.user_id, message: messageDetails.message });

    if (error) {
        console.error('Error posting group message:', error.message);
        throw error;
    }
}

export async function getGroupFullProfilePage(group: types.Group, supabaseClient: SupabaseClient<Database>): Promise<types.GroupHomePage> {
    const { data, error } = await supabaseClient
        .from('group_profile_page')
        .select('*')
        .eq('group_id', group.group_id);

    if (error) {
        console.error('Error fetching group profile page posts and categories:', error.message);
        throw error;
    }

    return data;
}

export async function getGroupProfilePagePostsAndCategories(group: types.Group, supabaseClient: SupabaseClient<Database>): Promise<any[]> {
    const { data, error } = await supabaseClient
        .from('group_profile_page')
        .select('*')
        .eq('group_id', group.group_id);

    if (error) {
        console.error('Error fetching group profile page posts and categories:', error.message);
        throw error;
    }

    return data;
}

export async function editGroupTodo(todoId: string, updatedDetails: object, group: types.Group, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_todos')
        .update(updatedDetails)
        .eq('id', todoId)
        .eq('group_id', group.group_id);

    if (error) {
        console.error('Error editing group todo:', error.message);
        throw error;
    }
}

export async function editGroupEvent(eventId: string, updatedDetails: object, group: types.Group, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_events')
        .update(updatedDetails)
        .eq('id', eventId)
        .eq('group_id', group.group_id);

    if (error) {
        console.error('Error editing group event:', error.message);
        throw error;
    }
}

export async function transferOwnership(group: types.Group, newOwner: types.User, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('groups')
        .update({ owner_id: newOwner.user_id })
        .eq('id', group.group_id);

    if (error) {
        console.error('Error transferring ownership:', error.message);
        throw error;
    }
}

export async function changeRoleOf(group: types.Group, member: types.User, newRole: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_members')
        .update({ role: newRole })
        .eq('group_id', group.group_id)
        .eq('member_id', member.user_id);

    if (error) {
        console.error('Error changing role of member:', error.message);
        throw error;
    }
}

export async function leaveGroup(group: types.Group, user: types.User, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('group_members')
        .delete()
        .eq('group_id', group.group_id)
        .eq('member_id', user.user_id);

    if (error) {
        console.error('Error leaving group:', error.message);
        throw error;
    }
}

export async function viewGroupCalendar(group: types.Group, supabaseClient: SupabaseClient<Database>): Promise<any[]> {
    const { data, error } = await supabaseClient
        .from('group_calendar')
        .select('*')
        .eq('group_id', group.group_id);

    if (error) {
        console.error('Error viewing group calendar:', error.message);
        throw error;
    }

    return data;
}