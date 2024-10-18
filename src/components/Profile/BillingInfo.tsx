import Link from "next/link";
import React from "react";
export default function BillingInfo() {
  return (
    <section className="font-Manrope lg:pl-24 lg:pr-[4.70rem] md:px-10 px-5  py-5 md:py-10  md:gap-5 gap-5 md:flex-row flex-col flex md:justify-between md:items-start">
      <h2 className="text-headingColor font-bold md:text-[2.125rem] text-[1.875rem] md:leading-[3rem] leading-[1.875rem] md:w-[40%]">
        Billing Information
      </h2>

      <div className="md:w-[70%]">
        {/* <section className="grid md:grid-cols-2 grid-cols-1  gap-x-5 md:gap-y-10 gap-5">
          <section>
            <p className="text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor mb-2">
              Amount of last payment
            </p>
            <p className="text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor">$1148.85</p>
          </section>

          <section>
            <p className="text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor mb-2">
              Date of last payment
            </p>
            <p className="text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor">07-22-2024</p>
          </section>
        </section> */}

        <section className="grid md:grid-cols-2 grid-cols-1  md:gap-y-10 gap-5 mb-10">
          <Link
            href="https://billing.stripe.com/p/login/bIY4jw5SV1Et97GcMM"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 py-2 px-5 w-fit h-fit text-base bg-blueColor hover:bg-blueHover rounded-full font-semibold border-transparent border-2 text-white"
          >
            Manage payment method
          </Link>
        </section>
      </div>
    </section>
  );
}
