"use client";
import React, { useState } from "react";
import { auth } from "@/app/firebase/config"; 
import { sendPasswordResetEmail } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";

export default function page() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!email) {
      setMessage("Please enter your email.");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent successfully.");
      toast.success("Password reset email sent!");
      setEmail("");
    } catch (error: any) {
      setMessage(
        error.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <section className="font-Manrope flex flex-col justify-center items-center my-16">
        <div className="xl:w-[35%] lg:w-[40%] md:w-[50%] w-[90%] rounded-xl mx-auto bg-lightGray">
          <div className="md:p-16 p-10">
            <h1 className="text-headingColor font-bold md:text-[2.3rem] text-[2.3rem]">
              Forgot Password
            </h1>
            <form onSubmit={handlePasswordReset}>
              <div className="flex flex-col gap-3">
                <div>
                  <label
                    className="block text-[1.1rem] mt-4 mb-2 text-bodyColor"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="rounded-full w-full py-2 outline-none px-3 border-blueColor border"
                    name="email"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    aria-label="Email"
                  />
                </div>
                <button
                  type="submit"
                  className="flex my-2 justify-start rounded-full w-fit py-2 px-10 bg-blueColor text-white hover:bg-blueHover"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Send Reset Link"}
                </button>
                {message && (
                  <p className="text-red-600 text-sm">{message}</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
