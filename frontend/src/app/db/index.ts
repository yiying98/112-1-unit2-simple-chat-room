import { Message } from "@/lib/types/message";
export const db: { messages: Message[] } = {
  messages: [
    {
      content: "Hello World",
      senderId: "yuchi",
      timestamp: new Date(),
    },
  ],
};
