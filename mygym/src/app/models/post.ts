import { User } from "./user";

export interface Post {
  id: string;
  name: string;
  description: string;
  readers:User[];
}
