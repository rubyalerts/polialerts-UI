"use client";
import BillingInfo from "@/components/Profile/BillingInfo";
import PersonalInfo from "@/components/Profile/PersonalInfo";
import PlanDetails from "@/components/Profile/PlanDetails";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useUser } from "@/hooks/useUser";
import React, { useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function Profile() {
  // Auth User
  const [user] = useAuthState(auth); //user variable

  //Auth User Session
  let userSession = null;
  if (typeof window !== "undefined") {
    userSession = sessionStorage.getItem("user");
  }

  //Router
  const router = useRouter();

  // If user not logged In (User session not found) - Logout
  if (!user && !userSession) {
    router.push("/login");
  }

  const { userDetails, loading, error, fetchUser } = useUserContext();
  console.log("userDetails", userDetails);

  useEffect(() => {
    if (user) {
      fetchUser(user.uid);
    }
  }, [user]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return (
      <div className="text-center mt-72 mb-72">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="font-Manrope lg:pl-24 lg:pr-[4.70rem] md:px-10 px-5 py-5 md:py-10  md:gap-5 gap-5 flex-col md:flex-row flex md:justify-between md:items-center">
        <h1 className="text-headingColor font-bold md:text-5xl md:leading-[4rem] text-[2.375rem] leading-[3.25rem] ">
          Your Profile
        </h1>
        <button className="py-2 px-5 w-fit text-base h-fit uppercase border-blueColor  font-semibold  border-2 rounded-xl text-blueColor">
          {userDetails?.subscription_type} plan
        </button>
      </div>

      <div className="lg:pl-24 lg:pr-[4.70rem] md:px-10 px-5">
        <hr className="w-[100%] border-iota" />
      </div>

      <PersonalInfo userDetails={userDetails} />
      <BillingInfo />
      <PlanDetails userDetails={userDetails} />
    </>
  );
}


