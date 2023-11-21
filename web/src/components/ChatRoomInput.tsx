"use client";

import { MessagesContext } from "@/context/message";
import { UserContext } from "@/context/user";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { TalkContext } from "@/context/talk";

function ChatRoomInput() {
  const { sendMessage } = useContext(MessagesContext);
  const { user, receiver } = useContext(UserContext);
  const [content, setContent] = useState<string>("");
  const {sendTalk} = useContext(TalkContext);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content) return;
    if (!user) return;
    if (!receiver) return;
    sendMessage({ content, senderId: user.displayId, receiverId: receiver.displayId });
    sendTalk({
      user1:user.displayId,
      user2:receiver.displayId,
    })
    setContent("");
  };
  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Aa"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="text-md flex-1 border border-gray-300 p-1 rounded-md outline-none focus:border-gray-600 transition duration-200 ease-in-out"
      />
      <button
        type="submit"
        className="bg-black text-white py-1 px-2 rounded-lg text-sm enabled:hover:bg-gray-700 transition duration-200 ease-in-out disabled:opacity-25"
        disabled={!receiver}
      >
        Send
      </button>
    </form>
  );
}

export default ChatRoomInput;
