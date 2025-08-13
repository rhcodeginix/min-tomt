import { useRouter } from "next/router";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

type UserLayoutContextType = {
  loginUser: boolean;
  setLoginUser: (value: boolean) => void;
};

export const UserLayoutContext = createContext<
  UserLayoutContextType | undefined
>(undefined);

export const useUserLayoutContext = () => {
  const context = useContext(UserLayoutContext);
  if (!context) {
    throw new Error(
      "useUserLayoutContext must be used within UserLayoutProvider"
    );
  }
  return context;
};

export const UserLayoutProvider = ({ children }: { children: ReactNode }) => {
  const [loginUser, setLoginUser] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("min_tomt_login");
    if (storedLoginStatus === "true") {
      setLoginUser(true);
    }
  }, [router.asPath]);

  return (
    <UserLayoutContext.Provider value={{ loginUser, setLoginUser }}>
      {children}
    </UserLayoutContext.Provider>
  );
};
