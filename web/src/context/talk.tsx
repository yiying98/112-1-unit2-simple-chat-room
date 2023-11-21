"use client";
import { createContext,useContext, useEffect, useState } from "react";
import type { Talk } from "@/package/types/talk";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { env } from "@/utils/env";
import { UserContext } from "@/context/user";

export type TalkContext = {
    talkList: Talk[];
    setTalkList:(talks: Talk[]) => void;
    socket: Socket | null;
    sendTalk:(talkInput: Omit<Talk, "timestamp">)=> Promise<void>;
}
export const TalkContext = createContext<TalkContext>({
    talkList: [],
    setTalkList: () => {},
    socket: null,
    sendTalk: async () => {},
  });

type Props = {
children: React.ReactNode;
};

export function UserProvider({ children }: Props) {
    const {user} = useContext(UserContext);
    const [talkList, setTalkList]=useState<Talk[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        const initSocket = () => {
          const socket = io(env.NEXT_PUBLIC_SOCKET_URL);
          socket.on("receive_talk", (newTalk: Talk) => {
            console.log("new talk");
            setTalkList((talk) => [...talk, newTalk]);
          });
          setSocket(socket);
        };
        const fetchTalks = async () => {
          try {
            const res = await fetch("/api/talks", {
                method: "GET",
                body: JSON.stringify({
                  user1:user?.displayId
                })});
            const data = await res.json();
            if (data?.talks) {
              setTalkList(data.talks);
              console.log(data.talks);
            }
          } catch (error) {
            console.log(error);
          }
        };
        initSocket();
        fetchTalks();
      }, []);
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
          console.log(data);
          if (data?.talk) {
            socket.emit("send_talk", data.talk);
          }
        } catch (error) {
          console.log(error);
        }
      };
      return (
        <TalkContext.Provider
          value={{ talkList, setTalkList, sendTalk, socket }}
        >
          {children}
        </TalkContext.Provider>
      );
}
