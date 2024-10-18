"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Icons/Logo";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [signOut] = useSignOut(auth);
  const [user] = useAuthState(auth); //user variable
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  //Auth User Session
  let userSession = null;
  if (typeof window !== "undefined") {
    userSession = sessionStorage.getItem("user");
  }

  //Router
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    const success = await signOut();
    if (success) {
      alert("Logged Out");
      sessionStorage.removeItem("user");
      router.push("/login");
    }
  };

  return (
    <>
      <header className="font-Manrope">
        <nav
          className="
            lg:pl-24 lg:pr-[4.70rem] md:px-10 px-5 py-5
            flex flex-wrap
            items-center
            justify-between
            w-full
            bg-bodyColor
          "
        >
          <div>
            <a href="#">
              <Logo />
            </a>
          </div>
          <svg
            onClick={toggleMenu}
            xmlns="http://www.w3.org/2000/svg"
            id="menu-button"
            className="h-6 w-6 cursor-pointer md:hidden block"
            fill="#ffffff"
            viewBox="0 0 24 24"
            stroke="#ffffff" // Ensures the stroke color is white
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <div
            className={`${isMenuOpen ? "block" : "hidden"} w-full md:flex md:items-center md:w-auto`}
            id="menu"
          >
            {isMenuOpen && (
              <hr className="my-2 w-[100%] border-white md:hidden" />
            )}
            <ul
              className="
                pt-4
                text-white text-sm leading-[1.375rem] md:text-base md:leading-7 font-semibold
                md:flex
                md:justify-between 
                md:pt-0
              "
            >
              <li>
                <Link href="/dashboard">
                  <p className="md:p-4 py-2 block hover:underline active:underline">
                    Dashboard
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/profile">
                  <p className="md:p-4 py-2 block hover:underline active:underline">
                    Profile
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/support">
                  <p className="md:p-4 py-2 block hover:underline active:underline">
                    Support
                  </p>
                </Link>
              </li>
              <li>
                {isMounted ? (
                  user || userSession ? (
                    <button
                      onClick={handleLogout}
                      className="md:p-4 py-2 block hover:underline active:underline text-left"
                    >
                      Log out
                    </button>
                  ) : (
                    <Link href="/login">
                      <p className="md:p-4 py-2 block hover:underline active:underline text-left">
                        Login
                      </p>
                    </Link>
                  )
                ) : null}
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}
