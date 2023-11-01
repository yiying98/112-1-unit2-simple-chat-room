"use client";
import { UserContext } from "@/context/user";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";

function SignInForm() {
  const { user, setUser } = useContext(UserContext);
  const [displayId, setDisplayId] = useState(user?.displayId ?? "");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUser({ displayId });
    router.push("/chat");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="border shadow-lg p-6 rounded-xl flex flex-col gap-4 lg:w-1/3 md:w-1/2 w-2/3"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold">Sign In</h1>
        <p className="text-sm text-gray-400 font-light text-clip">
          Enter your display ID to sign in. If you don't have a display ID, you
          can get one by signing up.
        </p>
      </div>
      <div className="grid grid-cols-4 gap-4 items-center">
        <label
          htmlFor="displayId"
          className="col-span-1 text-right text-sm font-semibold"
        >
          Display ID
        </label>
        <input
          className="col-span-3 focus:border-gray-600 transition duration-200 ease-in-out outline-none border p-1 rounded-md"
          type="text"
          id="displayId"
          value={displayId}
          required
          onChange={(e) => setDisplayId(e.target.value)}
        />
      </div>
      <div className="w-full flex justify-end">
        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded-lg text-sm hover:bg-gray-700 transition duration-200 ease-in-out"
        >
          Sign In
        </button>
      </div>
    </form>
  );
}

export default SignInForm;
