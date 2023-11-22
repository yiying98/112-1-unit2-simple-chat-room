import { User } from "./user";

export type Talk = {
    user1: User["displayId"];
    user2: User["displayId"];
    lastMessage:string;
    timestamp: Date;
  };