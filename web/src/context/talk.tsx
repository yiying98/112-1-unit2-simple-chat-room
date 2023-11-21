"use client";
import { createContext, useEffect, useState } from "react";
import type { Talk } from "@/package/types/talk";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { env } from "@/utils/env";

export type TalkContext = {
    talkList: Talk[];
    socket: Socket | null;
    sendTalk:(talkInput: Talk)=> Promise<void>;
}
export const TalkContext = createContext<TalkContext>({
    talkList: [],
    socket: null,
    sendTalk: async () => {},
  });

type Props = {
children: React.ReactNode;
};

