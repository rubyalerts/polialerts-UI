import React from "react";
import Logo from "@/components/Icons/Logo";

export default function Footer() {
  return (
    <div className="bg-bodyColor font-Manrope py-5 text-white lg:pl-24 lg:pr-[4.70rem] md:px-10 px-5  mt-5">
      <footer className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 justify-center items-start py-5">
        <div className="flex flex-col gap-4">
          <Logo />
        </div>
      </footer>
      <hr className="w-[100%] border-white mb-5 border-opacity-15" />
      <div className="flex md:flex-row flex-col justify-between gap-5">
        <div className="text-white text-xs leading-[1.125rem] md:text-sm md:leading-[1.25rem]">
          <a href="#" className="underline hover:no-underline">
            Privacy Policy
          </a>
          <a href="#" className="ml-3 underline hover:no-underline">
            Terms of Use
          </a>
        </div>
        <p className="text-xs leading-[1.125rem] md:text-sm md:leading-[1.25rem] text-white">
          © 2024 PoliAlerts. All rights reserved.
        </p>
      </div>
    </div>
  );
}
