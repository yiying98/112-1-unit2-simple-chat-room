"use client";
import { createContext, useEffect, useState } from "react";
import type { Message } from "@/lib/types/message";
import type { Socket} from "socket.io-client";
import { connect } from "socket.io-client";

export type MessagesContext = {
  messages: Message[];
  socket: Socket | null;
  setMessages: (messages: Message[]) => void;
  sendMessage: (message: Omit<Message, "timestamp">) => Promise<void>;
};

export const MessagesContext = createContext<MessagesContext>({
  messages: [],
  setMessages: () => {},
  socket: null,
  sendMessage: async () => {},
});

type Props = {
  children: React.ReactNode;
};

export function MessagesProvider({ children }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const initSocket = () => {
      const socket = connect(process.env.NEXT_PUBLIC_SOCKET_URL as string);
      socket.on("receive_message", (newMessage: Message) => {
        console.log("new message");
        setMessages((messages) => [...messages, newMessage]);
      });
      socket.on("new_connection", () => {
        console.log("new connection");
      });
      setSocket(socket);
    };
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/chats");
        const data = await res.json();
        if (data?.messages) {
          setMessages(data.messages);
          console.log(data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    initSocket();
    fetchMessages();
  }, []);

  const sendMessage = async (message: Omit<Message, "timestamp">) => {
    if (!socket) {
      alert("No socket! Please retry later.");
      return;
    }
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        body: JSON.stringify(message),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data?.message) {
        socket.emit("send_message", data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MessagesContext.Provider
      value={{ messages, setMessages, sendMessage, socket }}
    >
      {children}
    </MessagesContext.Provider>
  );
}
