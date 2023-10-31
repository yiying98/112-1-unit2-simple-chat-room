import ChatRoomInput from "@/components/ChatRoomInput";
import ChatRoomMessages from "@/components/ChatRoomMessages";
import React from "react";

function Chat() {
  return (
    <div className="w-full h-full overflow-hidden flex flex-col shadow-lg">
      <nav className="w-full shadow-md p-3 text-md font-semibold">Chatroom</nav>
      <div className="overflow-y-scroll grow">
        <ChatRoomMessages />
      </div>
      <div className="p-2">
        <ChatRoomInput />
      </div>
    </div>
  );
}

export default Chat;
