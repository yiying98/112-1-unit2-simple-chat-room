"use client";
import { MessagesContext } from "@/context/message";
import { UserContext } from "@/context/user";
import type { User } from "@/package/types/user";
import type { Message } from "@/package/types/message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import React, { useContext, useEffect, useState } from "react";
import Avatar from "./Avatar";
import { PlusSquare } from 'lucide-react';
import { db } from "@/db";
import { messagesTable, talksTable, usersTable} from "@/db/schema";
import { eq, desc, isNull, sql, and, or } from "drizzle-orm";
async function PreviewSection(){
    
    const { user, sendUser, userlist, receiver,setReceiver} = useContext(UserContext);
    const [formOpen, setformOpen] = useState(false);
    const [newUserId, setNewUserId] = useState(receiver?.displayId ?? "");
    const { messages } = useContext(MessagesContext);
    if(!user) return(
      <div className="px-2 pt-4"/>
    )

    const talks = await db.select({
      user1:talksTable.user1,
      user2:talksTable.user2,
      lastUpdate:talksTable.lastUpdate,
    }).from(talksTable)
      .orderBy(desc(talksTable.lastUpdate))
      .where(
        or(
            eq(talksTable.user1, user.displayId),
            eq(talksTable.user2, user.displayId)));
    
    function handleClick(message:Message){
      if(message.senderId===user?.displayId){
        setReceiver({displayId:message.receiverId});
      }
      else
      {
        setReceiver({displayId:message.senderId});
      }
      
    }
    function handleAdd() {
      setformOpen(true);
    }
    function handleClose() {
      sendUser({displayId:newUserId})
      setReceiver({displayId:newUserId})
      setformOpen(false);
    }

    const handleHookChange = (func: Function) => (event: React.ChangeEvent<HTMLInputElement>) => {
      func(event.target.value);
      };
    return (
      <div>
        <Dialog open={formOpen} onOpenChange={setformOpen}>
        <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new dialog</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Input name
            </Label>
            <Input
              placeholder="Any name"
              value = {newUserId}
              onChange = {handleHookChange(setNewUserId)}
              className="col-span-3"
            />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleClose}>Add</Button>
          </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className={"flex flex-col px-2 pt-4"}>
        <button
            className={"ml-auto"}
            onClick={handleAdd}
            >
            <div
                className={"flex items-center gap-1 rounded-full transition-colors duration-300 hover:bg-brand/10 mb-1"}
            >
                <PlusSquare size={32} />
            </div>
        </button>
        <div className="px-2 pt-4">
          {messages?.map((message, index) => {
            const isSender = message.senderId === user?.displayId;
            const isReceiver = message.receiverId === user?.displayId;
            if(isSender|| isReceiver)
            {
            return (
              <div key={index} className={`w-full pt-1 flex flex-row ${
                isReceiver && "bg-slate-100"
              }`} onClick={()=>handleClick(message)}>
                    <Avatar
                      displayId={isSender? message.receiverId : message.senderId}
                      classname="bg-black text-white w-8 h-8"
                    />
                    <div className="flex flex-col">
                    <div
                        className={`max-w-[60%] rounded-2xl px-3 py-1 leading-6 text-black`}
                    >
                      {isSender? message.receiverId : message.senderId}
                    </div>
                    <div
                        className={`max-w-[60%] rounded-2xl px-3 py-1 leading-6 text-black`}
                    >
                      {message.content}
                    </div>
                    </div>
                </div>
            );
          }
          })}
        </div>
        </div>
      </div>
      );
}
export default PreviewSection;