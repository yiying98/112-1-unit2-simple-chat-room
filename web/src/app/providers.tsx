import { UserProvider } from "@/context/user";
import React from "react";

type Props = {
  children: React.ReactNode;
};

function Providers({ children }: Props) {
  return (
    <>
      <UserProvider>{children}</UserProvider>
    </>
  );
}

export default Providers;
