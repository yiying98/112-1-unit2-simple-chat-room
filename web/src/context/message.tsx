"use client";
import { createContext, useEffect, useState, useContext } from "react";
import type { Message } from "@/package/types/message";
import type { Talk } from "@/package/types/talk";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { env } from "@/utils/env";
import { UserContext } from "@/context/user";

export type MessagesContext = {
  messages: Message[];
  socket: Socket | null;
  setMessages: (messages: Message[]) => void;
  sendMessage: (message: Omit<Message, "timestamp">) => Promise<void>;
  talkList: Talk[];
  setTalkList:(talks: Talk[]) => void;
  sendTalk:(talkInput: Omit<Talk, "timestamp">)=> Promise<void>;
};

export const MessagesContext = createContext<MessagesContext>({
  messages: [],
  setMessages: () => {},
  socket: null,
  sendMessage: async () => {},
  talkList: [],
  setTalkList: () => {},
  sendTalk: async () => {},
});

type Props = {
  children: React.ReactNode;
};

export function MessagesProvider({ children }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const {user} = useContext(UserContext);
  const [talkList, setTalkList]=useState<Talk[]>([]);

  useEffect(() => {
    const initSocket = () => {
      const socket = io(env.NEXT_PUBLIC_SOCKET_URL);
      socket.on("receive_message", (newMessage: Message) => {
        console.log("new message");
        setMessages((messages) => [...messages, newMessage]);
      });
      socket.on("receive_talk", (newTalk: Talk) => {
        console.log("new talk");
        setTalkList((talk) => [newTalk,...talk]);
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
    const fetchTalks = async () => {
      console.log("fetchtalks");
      try {
        const res = await fetch("/api/talks");
        const data = await res.json();
        if (data?.talks) {
          data.talks.map((talk:Talk,index:number)=>{
            if(talk.user1==user?.displayId || talk.user2==user?.displayId){
              setTalkList((talks) => [...talks, talk]);
            }
          })
        }
      } catch (error) {
        console.log(error);
      }
    };
    initSocket();
    fetchMessages();
    fetchTalks();
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
  const sendTalk = async (talk: Omit<Talk, "timestamp">) => {
    console.log(talk);
    if (!socket) {
      alert("No socket! Please retry later.");
      return;
    }
    try {
      const res = await fetch("/api/talks", {
        method: "POST",
        body: JSON.stringify(talk),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data?.talk) {
        socket.emit("send_talk", data.talk);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <MessagesContext.Provider
      value={{ messages, setMessages, sendMessage, socket, talkList, setTalkList, sendTalk }}
    >
      {children}
    </MessagesContext.Provider>
  );
}
