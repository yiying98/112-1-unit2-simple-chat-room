import ChatRoomInput from "@/components/ChatRoomInput";
import ChatRoomMessages from "@/components/ChatRoomMessages";
import React from "react";
import LoginSection from "@/components/LoginSection"
import PreviewSection from "@/components/PreviewSection"

function Chat() {
  return (
    <div className="w-full h-full flex flex-row">
      <div className="xl:w-1/6 md:w-1/2 sm:w-2/3 w-full h-full overflow-hidden flex flex-col shadow-lg">
        <nav className="w-full shadow-md p-3 text-md font-semibold">User</nav>
        <div className="overflow-y-scroll grow">
          <LoginSection/>
        </div>
      </div>
      <div className="xl:w-1/3 md:w-1/2 sm:w-2/3 w-full h-full overflow-hidden flex flex-col shadow-lg">
        <nav className="w-full shadow-md p-3 text-md font-semibold">Message</nav>
        <div className="overflow-y-scroll grow">
          <PreviewSection/>
        </div>
      </div>
      <div className="xl:w-1/2 md:w-1/2 sm:w-2/3 w-full h-full overflow-hidden flex flex-col shadow-lg">
        <nav className="w-full shadow-md p-3 text-md font-semibold">Chatroom</nav>
        <div className="overflow-y-scroll grow">
          <ChatRoomMessages />
        </div>
        <div className="p-2">
          <ChatRoomInput />
        </div>
      </div>
    </div>
  );
}

export default Chat;
