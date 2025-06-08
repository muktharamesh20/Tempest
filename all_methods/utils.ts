export type Post = {image: Image, caption: Text, categories: Category, ownerId: UserId, id: PostId, createdAt: Date, likeCount:number
, likedByMe: boolean, inspiredCount: number, comments: Comment[], linkedObject: Event | Todo};
export type Comment = {id: CommentId, ownerId: UserId, postId: PostId, content: Text, createdAt: Date, ownerUsername: UserId, reply_to_id: CommentId | null};
export type Calendar = {forNow:null}
export type Group = {forNow: null}
export type UserHomePage = {id: CategoryId, CategoryName: string, orderNum: number, posts: Post[], tags: Post[], followers: UserList, following: UserList, profile: User};
export type GroupHomePage = {CategoryName: string, orderNum: number, posts: Post[], tags: Post[], members: UserList, profile: User};
export type Feed = {forNow: null}
export type Message = {id: string, content: Text, createdAt: Date, senderId: string}
export type GroupChat = {name: string, id: string, members: {id: string, username: string}[], messages: Message[]};
export type FrinedChat = {name: string, id: string, members: {id: string, username: string}[], messages: Message[]};
export type Todo = {forNow: null}
export type KanbanBoard = {forNow: null}
export type Event = {forNow: null, canModify: boolean, canDelete: boolean}
export type Notification = {forNow: null}
export type NotificationList = {forNow: null}
export type User = {forNow: null}
export type UserList = {forNow: null}
export type Image = {forNow: null}
export type UserSettingsPage = {forNow: null}
export type Category = {name: string, id: string, orderNum: number};
export type Text = string;
export type UserId = string;
export type CommentId = string;
export type PostId = string;
export type GroupId = string;
export type EventId = string;
export type TodoId = string;
export type CategoryId = string;

export async function asyncTimer(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}