import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import type { Message } from "@/package/types/message";
import { messagesTable } from "@/db/schema";
import { eq, desc, sql, and, or } from "drizzle-orm";
const getMessageSchema = z.object({
  senderId: z.string().min(1).max(50),
  receiverId: z.string().min(1).max(50),
});
type GetMessageRequest = z.infer<typeof getMessageSchema>;
const postMessageSchema = z.object({
  content: z.string().min(1).max(500),
  senderId: z.string().min(1).max(50),
  receiverId:z.string().min(1).max(50),
});
type PostMessageRequest = z.infer<typeof postMessageSchema>;

export async function GET() {
  const messages = await db
      .select({
        content: messagesTable.content,
        senderId: messagesTable.senderId,
        receiverId: messagesTable.receiverId,
      })
      .from(messagesTable)
      .execute();
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
  const { content, senderId , receiverId } = data as PostMessageRequest;
  const timestamp = new Date();
  const newMessage: Message = {
    content,
    senderId,
    receiverId,
    timestamp
  };
  try {
    await db
      .insert(messagesTable)
      .values({
        content: content,
        senderId:senderId,
        receiverId:receiverId,
        timestamp:timestamp,
      })
      .execute();
  } catch (error) {
    // The NextResponse object is a easy to use API to handle responses.
    // IMHO, it's more concise than the express API.
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
  return NextResponse.json(
    {
      message: newMessage,
    },
    { status: 200 },
  );
}
