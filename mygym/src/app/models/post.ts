import { Observable } from "rxjs";
import { User } from "./user";

export interface Post {
  id: string;
  name: string;
  description: string;
  readerIds:string[];
  writerIds:string[];
  creatorId:string;
}
