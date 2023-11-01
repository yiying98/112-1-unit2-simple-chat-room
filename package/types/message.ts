import { User } from "./user";

export type Message = {
  content: string;
  senderId: User["displayId"];
  timestamp: Date;
};
