export type Post = {image: string, caption: string, categories: {name:string, id: string}[], ownerId: string, id: string, createdAt: Date, likeCount:number
, likedByMe: boolean, inspiredCount: number, comments: Comment[]};
export type Comment = {id: string, ownerId: string, postId: string, content: string, createdAt: Date, ownerUsername: string, reply_to_id: string | null};
export type Calendar = {forNow:null}

export async function asyncTimer(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}