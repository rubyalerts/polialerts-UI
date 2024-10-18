import FAQ from "@/components/FAQ/FAQ";
import React from "react";

export default function Support() {
  return (
    <div>
      <div className="font-Manrope lg:pl-24 lg:pr-[4.70rem] md:px-10 px-5 py-5 md:py-10   md:gap-5 gap-5 flex-col md:flex-row flex md:justify-between md:items-center">
        <h1 className="text-headingColor font-bold md:text-5xl md:leading-[4rem] text-[2.375rem] leading-[3.25rem] ">
          Support
        </h1>
      </div>

      <div className="lg:pl-24 lg:pr-[4.70rem] md:px-10 px-5">
        <hr className="w-[100%] border-iota" />
      </div>

      <div className="font-Manrope lg:pl-24 lg:pr-[4.70rem] md:px-10 px-5 py-5 md:pt-10">
        <h2 className="text-headingColor font-bold md:text-[2.125rem] text-[1.875rem] md:leading-[3rem] leading-[1.875rem] my-5 mb-10">
          Frequently asked questions
        </h2>
        <FAQ />
      </div>

      <section className="font-Manrope lg:pl-24 lg:pr-[4.70rem] md:px-10 px-5 py-5 md:py-10  md:gap-5 gap-5 md:flex-row flex-col flex md:justify-between md:items-start">
        <h2 className="text-headingColor font-bold md:text-[2.125rem] text-[1.875rem] md:leading-[3rem] leading-[1.875rem] md:w-[40%]">
          Contact us
        </h2>

        <div className="md:w-[70%] flex flex-col">
          <p className="text-bodyColor text-sm leading-[1.375rem] md:text-base md:leading-7">
            Need more support? Send us a message and a member of our team will
            reach out to help.
          </p>
          <form>
            <textarea
              className="rounded-xl w-full mt-5 px-3 border border-blueColor"
              name="message"
              id="message"
            ></textarea>
            <button
              type="submit"
              className=" mt-5 py-1 px-6 w-fit  h-fit text-base bg-blueColor hover:bg-blueHover rounded-full font-semibold border-transparent border-2 text-white"
            >
              Submit
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
