import React, { ReactNode, useEffect } from "react";
import Header from "../Ui/navbar";
import { UserLayoutProvider } from "@/context/userLayoutContext";
import { AddressProvider } from "@/context/addressContext";
import Chatbot from "../Ui/chatbot";
import { useRouter } from "next/router";
import { useCustomizeHouse } from "@/context/selectHouseContext";

type Props = {
  children: ReactNode;
};

const UserLayout = ({ children }: Props) => {
  const router = useRouter();
  const { updateCustomizeHouse } = useCustomizeHouse();

  useEffect(() => {
    if (!router.isReady) return;

    const { pathname } = router;

    if (!pathname.startsWith("husmodells")) {
      localStorage.removeItem("city");
      localStorage.removeItem("subcity");
    }
    if (
      !pathname.startsWith("/husmodells") &&
      !pathname.startsWith("/regulations")
    ) {
      localStorage.removeItem("customizeHouse");
      updateCustomizeHouse(null);
    }
  }, [router.pathname, router.isReady, updateCustomizeHouse]);

  return (
    <div
      className={`${
        router.pathname !== "/" &&
        router.pathname !== "/ferdighus" &&
        router.pathname !== "/hytte" &&
        router.pathname !== "/finansiering" &&
        "mt-[57px] md:mt-[80px] lg:mt-[82px]"
      }`}
    >
      <Chatbot />

      <UserLayoutProvider>
        <AddressProvider>
          <Header />
          <main>{children}</main>
        </AddressProvider>
      </UserLayoutProvider>
    </div>
  );
};

export default UserLayout;
