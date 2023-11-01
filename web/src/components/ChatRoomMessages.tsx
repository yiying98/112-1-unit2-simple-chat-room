"use client";
import { MessagesContext } from "@/context/message";
import { UserContext } from "@/context/user";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import Avatar from "./Avatar";

function ChatRoomMessages() {
  const { messages } = useContext(MessagesContext);
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
  }, [user, router]);

  return (
    <div className="px-2 pt-4">
      {messages?.map((message, index) => {
        const isSender = message.senderId === user?.displayId;
        return (
          <div key={index} className="w-full pt-1">
            <div
              className={`flex flex-row items-end gap-2 ${
                isSender && "justify-end"
              }`}
            >
              {!isSender && (
                <Avatar
                  displayId={message.senderId}
                  classname="bg-black text-white w-8 h-8"
                />
              )}
              <div
                className={`max-w-[60%] rounded-2xl px-3 py-1 leading-6 ${
                  isSender ? "bg-black text-white" : " bg-gray-200 text-black"
                }`}
              >
                {message.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatRoomMessages;
