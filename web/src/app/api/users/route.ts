import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import type { User } from "@/package/types/user";
import { usersTable } from "@/db/schema";
const postUserSchema = z.object({
    displayId: z.string().min(1).max(50),
  });

type PostUserRequest = z.infer<typeof postUserSchema>;

export async function GET() {
  const users =  await db
      .select(
        {senderId: usersTable.senderId}
      )
      .from(usersTable)
      .execute()
    return NextResponse.json(
      {
        users: users,
      },
      { status: 200 },
    );
  }

export async function POST(request: NextRequest) {
const data = await request.json();
try {
    postUserSchema.parse(data);
} catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
const { displayId } = data as PostUserRequest;
const newUser: User = {
    displayId,
};
db.users.push(newUser);
try {
  await db
    .insert(usersTable)
    .values({
      displayId:displayId,
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
    user: newUser,
    },
    { status: 200 },
);
}

  