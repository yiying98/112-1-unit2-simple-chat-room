"use client";
import { UserContext } from "@/context/user";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusSquare } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
  } from "@/components/ui/dialog";
import React, { useContext, useEffect, useState } from "react";

function AddDialogButton(){
    const {sendUser,receiver,setReceiver} = useContext(UserContext);
    const [newUserId, setNewUserId] = useState(receiver?.displayId ?? "");
    const [formOpen, setformOpen] = useState(false);
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
    return(
        <div>
            <Dialog open={formOpen}>
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
            </div>
        </div>
    )

};
export default AddDialogButton;
