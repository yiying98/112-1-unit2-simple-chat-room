"use client";
import { UserContext } from "@/context/user";
import { useRouter } from "next/navigation";
import { LogOut, MessageCircle } from 'lucide-react';
import React, { useContext, useState} from "react";
import type { EventHandler, MouseEvent } from "react";
import Avatar from "./Avatar";

function LoginSection(){
    const { user} = useContext(UserContext);
    const router = useRouter();
    const handleClick: EventHandler<MouseEvent> = async(e) => {
        e.stopPropagation();
        e.preventDefault();
        router.push("/");
    }
    if(!user) return(
        <footer className="mt-auto flex flex-row"/>
    )
    return (
        <div>
            <div
                className={"flex items-center gap-1 rounded-full transition-colors duration-300 hover:bg-brand/10"}
            >
                <MessageCircle size={48} />
            </div>
        <footer className="mt-auto flex flex-row fixed bottom-0">
            <Avatar
              displayId={user.displayId}
              classname="bg-black text-white w-12 h-12 ml-2 mb-2 mr-2"
            />
            <button
                className={"flex w-16 items-center gap-1 hover:text-brand"}
                onClick={handleClick}
                >
                <div
                    className={"flex items-center gap-1 rounded-full transition-colors duration-300 hover:bg-brand/10 mb-1"}
                >
                    <LogOut size={48} />
                </div>
            </button>
        </footer>
        </div>
    )
    
}
export default LoginSection;