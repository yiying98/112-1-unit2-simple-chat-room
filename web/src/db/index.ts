import type { Message } from "@/package/types/message";
import type { User } from "@/package/types/user"
export const db: { messages: Message[], users:User[] } = {
  messages: [],
  users:[]
};
