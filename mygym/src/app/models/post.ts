import { Observable } from "rxjs";
import { User } from "./user";

export interface Post {
  id: string;
  name: string;
  description: string;
  readers:User[];
  writers:User[];
  creator:User;
}
