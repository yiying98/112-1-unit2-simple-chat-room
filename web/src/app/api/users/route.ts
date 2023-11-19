import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import type { User } from "@/package/types/user";

const postUserSchema = z.object({
    displayId: z.string().min(1).max(50),
  });

type PostUserRequest = z.infer<typeof postUserSchema>;

export async function GET() {
    return NextResponse.json(
      {
        users: db.users,
      },
      { status: 200 },
    );
  }

export async function POST(request: NextRequest) {
const data = await request.json();
console.log("get date")
try {
    postUserSchema.parse(data);
} catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
const { displayId } = data as PostUserRequest;
console.log("get displayid")
const newUser: User = {
    displayId,
};
db.users.push(newUser);
return NextResponse.json(
    {
    user: newUser,
    },
    { status: 200 },
);
}

  