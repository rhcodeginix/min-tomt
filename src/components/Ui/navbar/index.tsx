import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Ic_logo from "@/public/images/Ic_logo.svg";
import Ic_menu from "@/public/images/Ic_menu.svg";
import Ic_close from "@/public/images/Ic_close.svg";
import Ic_search_file from "@/public/images/Ic_search_file.svg";
import Ic_mic from "@/public/images/Ic_mic.svg";
import Ic_logout from "@/public/images/Ic_logout.svg";
import Image from "next/image";
import { useUserLayoutContext } from "@/context/userLayoutContext";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { getVippsLoginUrl } from "@/utils/vippsAuth";
import { toast } from "@/hooks/use-toast";
import Button from "@/components/common/button";
import { ChevronDown } from "lucide-react";

const Header = () => {
  const { loginUser, setLoginUser } = useUserLayoutContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("min_tomt_login") === "true";
    setLoginUser(isLoggedIn);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const [userName, setUserName] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserName(userData.name);
          } else {
            console.error("No such document in Firestore!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("min_tomt_login");
      localStorage.removeItem("I_plot_email");
      setLoginUser(false);
      setUserName(null);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleVippsLogin = () => {
    try {
      const vippsUrl = getVippsLoginUrl();

      toast({
        title: "Redirecting to Vipps",
        description: `You'll be redirected to Vipps login page (${new URL(vippsUrl).origin}). Redirect URL: ${new URL(vippsUrl).searchParams.get("redirect_uri")}`,
      });

      setTimeout(() => {
        window.location.href = vippsUrl;
      }, 800);
    } catch (error) {
      console.error("Failed to initiate Vipps login:", error);
      toast({
        title: "Login Error",
        description: "Could not connect to Vipps. Please try again.",
        variant: "destructive",
      });
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    if (
      router.pathname !== "/" &&
      router.pathname !== "/ferdighus" &&
      router.pathname !== "/hytte" &&
      router.pathname !== "/finansiering"
    ) {
      setIsScrolled(true);
      return;
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [router.pathname]);

  return (
    <>
      <div
        className={`fixed w-full top-0 transition-colors duration-500 ${
          isScrolled ? "bg-[#000]" : "bg-transparent"
        }`}
        id="navbar"
        style={{ zIndex: 9999 }}
      >
        <div
          className={`px-4 sm:px-5 md:px-8 lg:px-10 big:px-[80px] xBig:px-[112px]`}
        >
          <div className="py-[12px] md:py-[20px] flex justify-between gap-[32px] items-center">
            <div className="flex items-center gap-3">
              <Image
                src={Ic_menu}
                alt="menu"
                className="lg:hidden"
                onClick={toggleDrawer}
                fetchPriority="auto"
              />
              <Link href={"/"} onClick={() => router.push("/")}>
                <Image
                  src={Ic_logo}
                  alt="logo"
                  className="w-[90px] lg:w-auto"
                  id="logo"
                  fetchPriority="auto"
                />
              </Link>
            </div>
            <div className="items-center gap-10 hidden lg:flex">
              <Link
                href={"/"}
                className={`text-base text-white font-medium border py-2 px-3 rounded-[40px] ${router.pathname === "/" ? "border-white" : "border-transparent"}`}
              >
                Tomteanalyse
              </Link>
              <Link
                href={"/ferdighus"}
                className={`text-base text-white font-medium border py-2 px-3 rounded-[40px] ${router.pathname === "/ferdighus" ? "border-white" : "border-transparent"}`}
              >
                Ferdighus
              </Link>
              <Link
                href={"/hytte"}
                className={`text-base text-white font-medium border py-2 px-3 rounded-[40px] ${router.pathname === "/hytte" ? "border-white" : "border-transparent"}`}
              >
                Hytte
              </Link>
              <Link
                href={"/finansiering"}
                className={`text-base text-white font-medium border py-2 px-3 rounded-[40px] ${router.pathname === "/finansiering" ? "border-white" : "border-transparent"}`}
              >
                Finansiering
              </Link>
            </div>
            <div>
              {loginUser ? (
                <div className="relative">
                  {userName && (
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={toggleDropdown}
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-[32px] md:w-[40px] h-[32px] md:h-[40px] flex items-center justify-center rounded-full border border-darkGreen bg-lightGreen font-semibold text-darkGreen">
                          {userName[0]}
                        </div>
                        <span className="text-white font-medium text-sm md:text-base">
                          {userName}
                        </span>
                      </div>
                      <ChevronDown className="text-white w-[20px] h-[20px] md:w-auto md:h-auto" />
                    </div>
                  )}
                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white shadow-shadow1 rounded-md shadow-lg p-2"
                      ref={dropdownRef}
                    >
                      <Link
                        href={"/search-history"}
                        className="px-2 py-1.5 text-sm hover:bg-lightPurple text-black w-full text-left cursor-pointer flex gap-2 items-center"
                        onClick={() => {
                          setIsDropdownOpen(false);
                        }}
                      >
                        <Image
                          src={Ic_search_file}
                          alt="search_file"
                          className="w-[20px] h-[20px] md:w-auto md:h-auto"
                          fetchPriority="auto"
                        />
                        Søkehistorikk
                      </Link>
                      <Link
                        href={"/add-plot-list"}
                        className="px-2 py-1.5 text-sm hover:bg-lightPurple text-black w-full text-left cursor-pointer flex gap-2 items-center"
                        onClick={() => {
                          setIsDropdownOpen(false);
                        }}
                      >
                        <Image
                          src={Ic_mic}
                          alt="mic"
                          className="w-[20px] h-[20px] md:w-auto md:h-auto"
                          fetchPriority="auto"
                        />
                        Annonser din tomt
                      </Link>
                      <Link
                        href={"/login"}
                        className="px-2 py-1.5 text-sm hover:bg-lightPurple text-black w-full text-left cursor-pointer flex gap-2 items-center"
                        onClick={handleLogout}
                      >
                        <Image
                          src={Ic_logout}
                          alt="logout"
                          className="w-[20px] h-[20px] md:w-auto md:h-auto"
                          fetchPriority="auto"
                        />
                        Logg ut
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  text="Logg inn"
                  className="bg-white text-darkGreen sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative"
                  onClick={handleVippsLogin}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          transition: "transform 1s, box-shadow 1s",
          transform: isDrawerOpen ? "translateX(0)" : "translateX(-100%)",
          background: isDrawerOpen ? "rgba(0, 0, 0, 0.6)" : "",
          zIndex: 999999,
        }}
        className={`fixed top-0 left-0 w-full h-screen z-50`}
      >
        <div className="bg-[#000] h-full px-4 sm:px-5 md:px-8 lg:px-10 big:px-[120px] w-[85%]">
          <div className="flex items-center justify-between py-4 mb-4">
            <div className="gap-[12px] flex items-center">
              <Link href={"/"}>
                <Image
                  src={Ic_logo}
                  alt="logo"
                  className="w-[100px] lg:w-auto"
                  fetchPriority="auto"
                />
              </Link>
            </div>
            <button onClick={toggleDrawer} className="text-3xl">
              <Image src={Ic_close} alt="close" fetchPriority="auto" />
            </button>
          </div>
          <div className="flex flex-col items-start font-medium gap-4">
            <Link
              href={"/"}
              className={`text-base text-white font-medium border py-2 px-3 rounded-[40px] ${router.pathname === "/" ? "border-white" : "border-transparent"}`}
              onClick={() => setIsDrawerOpen(false)}
            >
              Tomteanalyse
            </Link>
            <Link
              href={"/ferdighus"}
              className={`text-base text-white font-medium border py-2 px-3 rounded-[40px] ${router.pathname === "/ferdighus" ? "border-white" : "border-transparent"}`}
              onClick={() => setIsDrawerOpen(false)}
            >
              Ferdighus
            </Link>
            <Link
              href={"/hytte"}
              className={`text-base text-white font-medium border py-2 px-3 rounded-[40px] ${router.pathname === "/hytte" ? "border-white" : "border-transparent"}`}
              onClick={() => setIsDrawerOpen(false)}
            >
              Hytte
            </Link>
            <Link
              href={"/finansiering"}
              className={`text-base text-white font-medium border py-2 px-3 rounded-[40px] ${router.pathname === "/finansiering" ? "border-white" : "border-transparent"}`}
              onClick={() => setIsDrawerOpen(false)}
            >
              Finansiering
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
