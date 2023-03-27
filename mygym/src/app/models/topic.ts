import { Post } from "./post";
import { User } from "./user";

export interface Topic {
    id: string;
    name: string;
    posts: Post[];
    creator:User;
}
