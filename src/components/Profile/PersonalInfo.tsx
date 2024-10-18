"use client";
import React, { useEffect, useState } from "react";
import { User } from "@/types";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
interface UserDetailsProp {
  userDetails: User | null;
}
export default function PersonalInfo({ userDetails }: UserDetailsProp) {

  const { updateProfile } = useUser();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNo, setPhoneNo] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  console.log("userDetails", userDetails);

  useEffect(() => {
    if (userDetails) {
      setFirstName(userDetails.firstName || "");
      setLastName(userDetails.lastName || "");
      setEmail(userDetails.email || "");
      setPhoneNo(userDetails.phoneNo || "");
      setStreet(userDetails.street || "");
      setCity(userDetails.city || "");
      setCountry(userDetails.country || "");
      setPostalCode(userDetails.postalCode || "");
    }
  }, [userDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //integration of update profile  method for testing purpose

    const updatedUser = {
      firstName,
      lastName,
      email,
      phoneNo,
      street,
      city,
      country,
      postalCode,
    };
    setLoading(true);
    try {

      console.log("Level 0");

      if (!userDetails?.id) throw new Error("User not found.");

      await updateProfile(updatedUser, userDetails.id);
      console.log("After updateProfile");

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevert = async () => {
    setFirstName(userDetails?.firstName || "");
    setLastName(userDetails?.lastName || "");
    setEmail(userDetails?.email || "");
    setPhoneNo(userDetails?.phoneNo || "");
    setStreet(userDetails?.street || "");
    setCity(userDetails?.city || "");
    setCountry(userDetails?.country || "");
    setPostalCode(userDetails?.postalCode || "");
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <section className="font-Manrope lg:pl-24 lg:pr-[4.70rem] md:px-10 px-5  py-5 md:py-10  md:gap-5 gap-5 md:flex-row flex-col flex md:justify-between md:items-start">
        <h2 className="text-headingColor font-bold md:text-[2.125rem] text-[1.875rem] md:leading-[3rem] leading-[1.875rem] md:w-[40%]">
          Personal Information
        </h2>
        <div className=" md:w-[70%]">
          <form
            onSubmit={handleSubmit}
            className="gap-x-5 md:gap-y-10 gap-5 grid md:grid-cols-2 grid-cols-1 mb-10"
          >
            <section className="">
              <label
                htmlFor="first-name"
                className="block mb-2 text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor"
              >
                First Name
              </label>
              <input
                required
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                name="first-name"
                type="text"
                className="rounded-full border border-blueColor outline-none w-full py-2 px-3"
                placeholder="John"
              />
            </section>
            <section className="">
              <label
                htmlFor="last-name"
                className="block mb-2 text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor"
              >
                Last Name
              </label>
              <input
                required
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                name="last-name"
                type="text"
                className="rounded-full border border-blueColor outline-none w-full py-2 px-3"
                placeholder="Smith"
              />
            </section>
            <section className="">
              <label
                htmlFor="email"
                className="block mb-2 text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor"
              >
                Email address
              </label>
              <input
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                name="email"
                type="email"
                className="rounded-full border border-blueColor outline-none w-full py-2 px-3"
                placeholder="john.smith@email.com"
              />
            </section>
            <section className="">
              <label
                htmlFor="phone"
                className="block mb-2 text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor"
              >
                Phone number
              </label>
              <input
                required
                value={phoneNo}
                onChange={(e) => {
                  setPhoneNo(e.target.value);
                }}
                name="phone"
                type="tel"
                className="rounded-full border border-blueColor outline-none w-full py-2 px-3"
                placeholder="416-555-5555"
              />
            </section>
            <section className="">
              <label
                htmlFor="street"
                className="block mb-2 text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor"
              >
                Street number and name{" "}
              </label>
              <input
                value={street}
                onChange={(e) => {
                  setStreet(e.target.value);
                }}
                name="street"
                type="text"
                className="rounded-full border border-blueColor outline-none w-full py-2 px-3"
                placeholder="25 Main Street"
              />
            </section>
            <section className="">
              <label
                htmlFor="City"
                className="block mb-2 text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor"
              >
                City
              </label>
              <input
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                }}
                name="City"
                type="text"
                className="rounded-full border border-blueColor outline-none w-full py-2 px-3"
                placeholder="Toronto"
              />
            </section>
            <section className="">
              <label
                htmlFor="country"
                className="block mb-2 text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor"
              >
                Country
              </label>
              <input
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                }}
                name="country"
                type="text"
                className="rounded-full border border-blueColor outline-none w-full py-2 px-3"
                placeholder="Canada"
              />
            </section>
            <section className="">
              <label
                htmlFor="postal-code"
                className="block mb-2 text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor"
              >
                Postal code
              </label>
              <input
                value={postalCode}
                onChange={(e) => {
                  setPostalCode(e.target.value);
                }}
                name="postal-code"
                type="text"
                className="rounded-full border border-blueColor outline-none w-full py-2 px-3"
                placeholder="M5E 0A2"
              />
            </section>
            <section className="buttons flex gap-5  md:flex-row flex-col ">
              <button
                type="submit"
                className="py-2 px-5 w-fit h-fit text-base bg-blueColor hover:bg-blueHover rounded-full font-semibold border-transparent border-2 text-white"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save changes"}{" "}
                {/* Show loading text */}
              </button>
              <button
                onClick={() => handleRevert()}
                type="button"
                className="py-2 px-5 w-fit  h-fit text-base border-blueColor  font-semibold  border-2  rounded-full text-blueColor"
              >
                Revert
              </button>
            </section>
          </form>
        </div>
      </section>
    </>
  );
}
