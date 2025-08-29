"use client";
import React, { useEffect, useState } from "react";
import MainSection from "./homepage/mainSection";
import HowItWorks from "./homepage/howItWorks";
import Footer from "@/components/Ui/footer";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Loader from "@/components/Loader";
import FåInnsiktI from "./homepage/fåInnsiktI";
import Property from "./homepage/property";
import AboutUs from "./homepage/aboutUs";
import Expected from "./homepage/expected";

const index = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const code: any = urlParams.get("code");
    const error = urlParams.get("error");

    if (code) {
      callApi(code);
    } else if (error) {
      console.error(error);
    }

    function callApi(code: any) {
      setLoading(true);

      fetch(
        "https://ox9ncjtau6.execute-api.eu-north-1.amazonaws.com/prod/auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: code }),
        }
      )
        .then((response) => response.json())

        .then(async (data) => {
          data = JSON.parse(data);

          const userEmail = data?.email;
          const userName = data?.name;
          const userUid = data?.sub;

          const usersRef = collection(db, "users");

          const q = query(usersRef, where("email", "==", userEmail));

          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            console.log("-----------1");
            try {
              const existingUserDoc: any = querySnapshot.docs[0];
              const userData = existingUserDoc.data();
              const userDocRef = existingUserDoc.ref;

              if (
                userData.loginType === "form" ||
                userData.loginType === "google"
              ) {
                router.push("/login");
                toast.error(
                  `Already have user with ${userData.loginType === "form" ? "form fill" : `${userData.loginType} login`}`,
                  {
                    position: "top-right",
                  }
                );
                return;
              }

              console.log(auth, userEmail, userUid);

              await signInWithEmailAndPassword(auth, userEmail, userUid);
              console.log("------");

              localStorage.setItem("min_tomt_login", "true");

              await updateDoc(userDocRef, {
                updatedAt: new Date(),
                loginCount: increment(1),
              });
              toast.success("Vipps login successfully", {
                position: "top-right",
              });
              localStorage.setItem("I_plot_email", userEmail);
              const redirectPath = Cookies.get("vipps_redirect_old_path");
              if (redirectPath) {
                Cookies.remove("vipps_redirect_old_path");
                window.location.assign(redirectPath);
              } else {
                router.push("/");
              }
            } catch (error) {
              console.error("Login error:", error);
              toast.error("Login failed.", {
                position: "top-right",
              });
            } finally {
              setLoading(false);
            }
          } else {
            console.log("-----------2", data);

            try {
              const userCredential = await createUserWithEmailAndPassword(
                auth,
                userEmail,
                userUid
              );
              const createdUser = userCredential.user;

              const userDocRef = doc(db, "users", createdUser.uid);

              const docSnap = await getDoc(userDocRef);

              if (!docSnap.exists()) {
                await setDoc(userDocRef, {
                  email: createdUser.email,
                  uid: createdUser.uid,
                  loginType: "vipps",
                  name: userName,
                  createdAt: new Date(),
                  address: data?.address,
                  data: data,
                });
                await signInWithEmailAndPassword(auth, userEmail, userUid);
                localStorage.setItem("min_tomt_login", "true");
                toast.success("Vipps login successfully", {
                  position: "top-right",
                });

                await updateDoc(userDocRef, {
                  updatedAt: new Date(),
                  loginCount: increment(1),
                });
                const redirectPath = Cookies.get("vipps_redirect_old_path");
                if (redirectPath) {
                  Cookies.remove("vipps_redirect_old_path");
                  window.location.assign(redirectPath);
                } else {
                  router.push("/");
                }
                localStorage.setItem("I_plot_email", userEmail);
              }
            } catch (error: any) {
              if (error.code === "auth/email-already-in-use") {
                console.log("-----------3", data);

                const existingUserDoc: any = querySnapshot.docs[0];
                const userData = existingUserDoc.data();
                const userDocRef = existingUserDoc.ref;

                if (
                  userData.loginType === "form" ||
                  userData.loginType === "google"
                ) {
                  router.push("/login");
                  toast.error(
                    `Already have user with ${userData.loginType === "form" ? "form fill" : `${userData.loginType} login`}`,
                    {
                      position: "top-right",
                    }
                  );
                  return;
                }
                try {
                  await signInWithEmailAndPassword(auth, userEmail, userUid);
                  localStorage.setItem("min_tomt_login", "true");
                  toast.success("Vipps login successfully", {
                    position: "top-right",
                  });
                  const redirectPath = Cookies.get("vipps_redirect_old_path");
                  if (redirectPath) {
                    Cookies.remove("vipps_redirect_old_path");
                    window.location.assign(redirectPath);
                  } else {
                    router.push("/");
                  }

                  await updateDoc(userDocRef, {
                    updatedAt: new Date(),
                    loginCount: increment(1),
                  });
                  localStorage.setItem("I_plot_email", userEmail);
                } catch (error) {
                  console.error("Login error:", error);
                  router.push("/login");
                  toast.error("Vipps login failed.", {
                    position: "top-right",
                  });
                } finally {
                  setLoading(false);
                }
              } else {
                console.error("Error:", error.message);
                router.push("/login");
                toast.error("An error occurred. Please try again.", {
                  position: "top-right",
                });
              }
            } finally {
              setLoading(false);
            }
          }
        })
        .catch((error) => {
          router.push("/login");
          console.error("API error:", error);
          toast.error("Something went wrong!.", {
            position: "top-right",
          });
        });
    }
  }, []);
  return (
    <>
      <div
        className="relative"
        style={{
          zIndex: 99999,
        }}
      >
        {loading && <Loader />}
      </div>

      <div className="relative">
        <MainSection />
        <FåInnsiktI />
        <Property />
        <HowItWorks />
        <AboutUs />
        <Expected />
        <Footer />
      </div>
    </>
  );
};

export default index;
