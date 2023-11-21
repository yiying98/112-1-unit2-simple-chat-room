import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import type { Talk } from "@/package/types/talk";
import { talksTable } from "@/db/schema";
import { and, eq, sql, or,desc } from "drizzle-orm";

const postTalkSchema = z.object({
    user1: z.string().min(1).max(50),
    user2:z.string().min(1).max(50),
  });
type postTalkRequest = z.infer<typeof postTalkSchema>;

const getTalkSchema = z.object({
    user1: z.string().min(1).max(50),
  });
type getTalkRequest = z.infer<typeof getTalkSchema>;

export async function GET(request: NextRequest) {
    const data = await request.json();
  try {
        getTalkSchema.parse(data);
        } catch (error) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }
    const talks = await db
        .select({
          user1: talksTable.user1,
          user2: talksTable.user2,
          lastUpdate: talksTable.lastUpdate,
        })
        .from(talksTable)
        .where(or
            (eq(talksTable.user1,data.user1),
             eq(talksTable.user2,data.user1)))
        .orderBy(desc(talksTable.lastUpdate))
        .execute();
    return NextResponse.json(
      {
        talks: talks,
      },
      { status: 200 },
    );
  };

  export async function POST(request: NextRequest) {
    const data = await request.json();
    try {
        postTalkSchema.parse(data);
    } catch (error) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const { user1,user2} = data as postTalkRequest;
    const timestamp = new Date();
    const newTalk: Talk = {
      user1,
      user2,
      timestamp
    };
    try {
      await db
        .insert(talksTable)
        .values({
          user1:user1,
          user2:user2,
        })
        .onConflictDoUpdate({
            target: [talksTable.user1,talksTable.user2],
            set: {
              user1: user1,
              user2: user2,
              lastUpdate:timestamp,
            },
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
        talk: newTalk,
      },
      { status: 200 },
    );
  }