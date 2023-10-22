import { UserProvider } from "@/context/user";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  return (
    <>
      <UserProvider>{children}</UserProvider>
    </>
  );
};

export default Providers;
