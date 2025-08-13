import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  const checkAuth = () => {
    const email = localStorage.getItem("I_plot_email");

    if (email) {
      setIsAuthenticated(true);
      if (router.pathname === "/login") {
        router.push("/");
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const interval = setInterval(() => {
      checkAuth();
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [router]);

  return isAuthenticated;
};

export default useAuth;
