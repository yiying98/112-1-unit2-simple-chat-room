"use client";
import { MessagesContext } from "@/context/message";
import { UserContext } from "@/context/user";
import { useRouter } from "next/navigation";
import type { User } from "@/package/types/user";
import React, { useContext, useEffect } from "react";
import type { EventHandler, MouseEvent } from "react";
import Avatar from "./Avatar";

function PreviewSection(){
    const { messages } = useContext(MessagesContext);
    const { user, userlist, setReceiver } = useContext(UserContext);
    function handleClick(userfetched:User){
        setReceiver(userfetched);
    }
    const router = useRouter();
    if(!user) return(
        <div className="px-2 pt-4"/>
    )
    return (
        <div className="px-2 pt-4">
          {userlist?.map((userfetched, index) => {
            const isSame = userfetched.displayId === user?.displayId;
            return (
              <div key={index} className="w-full pt-1 flex flex-row" onClick={()=>handleClick(userfetched)}>
                  {!isSame && (
                    <Avatar
                      displayId={userfetched.displayId}
                      classname="bg-black text-white w-8 h-8"
                    />
                  )}
                  {!isSame && (
                    <div
                        className={`max-w-[60%] rounded-2xl px-3 py-1 leading-6 bg-white text-black`}
                    >
                      {userfetched.displayId}
                    </div>
                  )}
                </div>
            );
          })}
        </div>
      );
}
export default PreviewSection;