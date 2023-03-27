import { user } from "./user";

export interface Topic {
    id: string;
    name: string;
    creator:user;
}
