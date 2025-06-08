import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../databasetypes";

export type Post = {image: Image, caption: Text, categories: Category, ownerId: UserId, id: PostId, createdAt: Date, likeCount:number
, likedByMe: boolean, inspiredCount: number, comments: Comment[], linkedObject: Event | Todo};
export type Comment = {id: CommentId, ownerId: UserId, postId: PostId, content: Text, createdAt: Date, ownerUsername: UserId, reply_to_id: CommentId | null};
export type Calendar = {forNow:null}
export type Group = {forNow: null, group_id: GroupId, onlyAdminsInvite: boolean, onlyAdminsAssignTodos: boolean}
export type UserHomePage = {id: CategoryId, CategoryName: string, orderNum: number, posts: Post[], tags: Post[], followers: UserList, following: UserList, profile: User, mutual_groups: GroupList};
export type GroupHomePage = {CategoryName: string, orderNum: number, posts: Post[], tags: Post[], members: UserList, profile: User};
export type Feed = {forNow: null}
export type Message = {id: string, content: Text, createdAt: Date, senderId: string}
export type GroupChat = {name: string, id: string, members: UserList, messages: Message[]};
export type FrinedChat = {name: string, id: string, members: UserList, messages: Message[]};
export type Todo = {forNow: null}
export type KanbanBoard = {forNow: null}
export type Event = {forNow: null, canModify: boolean, canDelete: boolean}
export type Notification = {forNow: null}
export type NotificationList = {forNow: null}
export type User = {forNow: null, user_id: UserId} //like a follower list... just the basics
export type GroupUser = {user: User, role: Role, group: Group}
export type UserList = User[]
export type GroupUserList = GroupUser[]
export type GroupList = Group[]
export type Image = {forNow: null}
export type DefaultProfilePicture = null
export type ProfilePicture = {forNow: null} 
export type UserSettingsPage = {forNow: null}
export type GroupSettingsPage = {forNow: null}
export type Setting = {forNow: null, canModify: boolean, canDelete: boolean}
export type Category = {name: string, id: string, orderNum: number};
export type Text = string;
export type UserId = string;
export type CommentId = string;
export type PostId = string;
export type GroupId = string;
export type EventId = string;
export type TodoId = string;
export type CategoryId = string;
export type Role = 'admin' | 'owner' | 'general'; 

export async function asyncTimer(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class NotImplementedError extends Error {
    constructor(functionName: string) {
        super(`${functionName} is not implemented.`);
        this.name = 'NotImplementedError';
    }
}

export function getBatchUsers(userIds: UserId[], supabaseClient: SupabaseClient<Database>): Promise<userList> {
    throw new NotImplementedError('getBatchUsers');
}

/**
 * Given group details, creates a group and returns the created group.
 * 
 * @param groupDetails 
 * @param supabaseClient 
 */
export async function createGroupTypeWithData(groupDetails: { name: string; description: Text; profilePicture: ProfilePicture | DefaultProfilePicture, public_special_events: boolean, title: string }, supabaseClient: SupabaseClient<Database>): Promise<types.Group> {
    throw new NotImplementedError('createGroupTypeWithData');
}