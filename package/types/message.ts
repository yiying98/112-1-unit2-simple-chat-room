import { User } from "./user";

export type Message = {
  content: string;
  senderId: User["displayId"];
  receiverId: User["displayId"];
  timestamp: Date;
};
