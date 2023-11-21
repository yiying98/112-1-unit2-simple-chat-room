"use client";
import type { Socket } from "socket.io-client";
import type { User } from "@/package/types/user";
import { createContext, useEffect, useState } from "react";
import type { Message } from "@/package/types/message";
import { io } from "socket.io-client";
import { env } from "@/utils/env";

export type UserContext = {
  user: User | null;
  userlist:User[];
  socket: Socket | null;
  setUser: (user: User) => void;
  sendUser: (userinput: User)=> Promise<void>;
  receiver: User | null;
  setReceiver: (receiver: User) => void;
};

export const UserContext = createContext<UserContext>({
  user: null,
  userlist: [],
  setUser: () => {},
  socket: null,
  sendUser: async () => {},
  receiver: null,
  setReceiver: ()=> {}
});

type Props = {
  children: React.ReactNode;
};
export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [receiver, setReceiver] = useState<User | null>(null);
  const [userlist, setUserlist] = useState<User[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  
  useEffect(() => {
    const initSocket = () => {
      const socket = io(env.NEXT_PUBLIC_SOCKET_URL);
      socket.on("receive_user", (newUser: User) => {
        console.log("new user");
        setUserlist((users) => [...users, newUser]);
      });
      setSocket(socket);
    };
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (data?.messages) {
          setUserlist(data.users);
          console.log(data.users);
        }
      } catch (error) {
        console.log(error);
      }
    };
    initSocket();
    fetchUsers();
  }, []);
  
  const sendUser = async (userinput: User) => {
    if (!socket) {
      alert("No socket! Please retry later.");
      return;
    }
    try {
      console.log(JSON.stringify(userinput))
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(userinput),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data?.user) {
        socket.emit("send_user", data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <UserContext.Provider value={{ user, setUser, sendUser, socket, userlist, receiver, setReceiver}}>
      {children}
    </UserContext.Provider>
  );
}
