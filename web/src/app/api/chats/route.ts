import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import type { Message } from "@/package/types/message";

const postMessageSchema = z.object({
  content: z.string().min(1).max(500),
  senderId: z.string().min(1).max(50),
});
type PostMessageRequest = z.infer<typeof postMessageSchema>;

export async function GET() {
  return NextResponse.json(
    {
      messages: db.messages,
    },
    { status: 200 },
  );
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    postMessageSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { content, senderId } = data as PostMessageRequest;
  const timestamp = new Date();
  const newMessage: Message = {
    content,
    senderId,
    timestamp,
  };
  db.messages.push(newMessage);
  return NextResponse.json(
    {
      message: newMessage,
    },
    { status: 200 },
  );
}
