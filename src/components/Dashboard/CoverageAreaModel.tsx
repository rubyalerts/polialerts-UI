"use client";
import { useState } from "react";
import Modal from "react-modal";
import Close from "@/components/Icons/Close";
import { IoMdArrowDropdown } from "react-icons/io";
import Institution from "@/components/Icons/Institution";
import { Category, User } from "@/types";
import { IoCloseSharp } from "react-icons/io5";

interface CoverageAreaModelProps {
  addChannel: (main_category: string, sub_category: string, channelId: string) => void;
  fetchSubCategories: (parent: string) => void;
  mainCategories: Category[];
  userDetails: User;
  fetchUser: (userId: string) => void;
  subCategories: Category[];
}

export default function CoverageAreaModel({
  addChannel,
  fetchSubCategories,
  fetchUser,
  mainCategories,
  userDetails,
  subCategories,
}: CoverageAreaModelProps) {
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
  };

  const [mainCategory, setMainCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  let subtitle;
  const [isAddChannelModalOpen, setIsAddChannelOpen] = useState<boolean>(false);
  const [isChannelLimitReachedModalOpen, setIsChannelLimitReachedModalOpen] = useState<boolean>(false);
  function handleOpenAddChannelModal() {
    // Check if user can add another Channel
    const channelsCount = Object.keys(userDetails.channels).length;
    console.log("channelsCount", channelsCount);
    console.log("userDetails.subscriptionDetails", userDetails.subscriptionDetails);

    if (userDetails.subscriptionDetails?.channels_limit && channelsCount >= userDetails.subscriptionDetails.channels_limit) {
      handleOpenChannelLimitReachedModal();
      return;
    }

    setIsAddChannelOpen(true);
  }

  function handleOpenChannelLimitReachedModal() {
    setIsChannelLimitReachedModalOpen(true);
  }

  function handleCloseLimitReachedModal() {
    setIsChannelLimitReachedModalOpen(false);
  }

  function afterOpenModal() { }
  function handleCloseAddChannelModal() {
    setIsAddChannelOpen(false);
  }

  const handleMainCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    fetchSubCategories(e.target.value); //Fetching Sub-Categories

    let mainCat = mainCategories.find(
      (category) => category.id === e.target.value
    );
    if (mainCat) {
      setMainCategory(mainCat.name);
    }
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let subCat = subCategories.find(
      (category) => category.id === e.target.value
    );
    if (subCat) {
      setSubCategory(subCat.name);
    }
  };

  // Add
  const handleAddArea = async () => {
    try {
      console.log("Adding Area...", subCategories);

      // Count how many channels do we have.
      const channelsCount = userDetails.channels.length;

      // Limit Reached
      if (userDetails.subscriptionDetails?.channels_limit && channelsCount >= userDetails.subscriptionDetails.channels_limit) {
        console.log("Channel Limit Reached");
        return;
      }

      // Jurisdiction Already in Use
      const isJurisdictionInUse = userDetails.channels.find(
        (channel) => channel.sub_category === subCategory
      );
      if (isJurisdictionInUse) {
        console.log("Jurisdiction Already in Use");
        setError("Jurisdiction Already in Use");

        setTimeout(() => {
          setError(null);
        }
          , 3000);

        return;
      }

      // Getting the channelId
      const channelId = subCategories.find(cat => cat.name === subCategory)?.streaming_source;
      if (!channelId) throw new Error("Channel ID not found.");

      await addChannel(mainCategory, subCategory, channelId);
      handleCloseAddChannelModal();

      // Resetting the values
      setMainCategory("");
      setSubCategory("");

      if (!userDetails.id) throw new Error("User not found.");
      // Updating the user details
      fetchUser(userDetails.id);

    } catch (error) {
      console.log("Error in adding area", error);
    }
  };

  return (
    <>
      <div className="font-Manrope">
        <div
          onClick={handleOpenAddChannelModal}
          className="cursor-pointer mt-5 px-7 py-1 w-fit h-fit bg-blueColor hover:bg-blueHover rounded-full  border-transparent border-2 text-white flex items-center text-base font-semibold"
        >
          <span className="font-semibold mr-3 text-3xl">+</span>
          New coverage area
        </div>
        <Modal
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%]  md:w-[50%] py-16 px-10 bg-white shadow-sm outline-none border rounded-3xl"
          isOpen={isAddChannelModalOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={handleCloseAddChannelModal}
          style={customStyles}
          contentLabel="Delete Confirmation Modal"
        >
          <div
            onClick={handleCloseAddChannelModal}
            className="absolute top-3  cursor-pointer right-5"
          >
            <button className=" text-iota text-4xl font-bold">
              <IoCloseSharp />
            </button>
          </div>
          {
            error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-3" role="alert">
                <strong className="font-bold">Error! </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )
          }
          <div className="font-semibold text-xl">
            <div className="flex gap-3 items-center">
              <Institution />
              <h3 className="text-headingColor font-bold text-[1.375rem] leading-[1.875rem] md:text-[1.625rem] md:leading-[2.375rem]">
                New coverage area
              </h3>
            </div>
          </div>

          <>
            <div className="flex gap-5 flex-col lg:flex-row lg:items-center mt-5">
              <div className="select-wrapper relative w-full lg:w-auto">
                <select
                  onChange={handleMainCategoryChange}
                  className="block appearance-none w-full bg-white border border-blueColor text-bodyColor py-2 md:px-6 md:pr-16 px-4 pr-8 rounded-full leading-tight focus:outline-none focus:bg-white focus:border-blueColor"
                >
                  <option value="">Select level of government</option>
                  {mainCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <IoMdArrowDropdown className="text-2xl text-blueColor" />
                </div>
              </div>
              {subCategories.length > 0 && (
                <div className="select-wrapper relative  w-full lg:w-auto">
                  <select
                    onChange={handleSubCategoryChange}
                    className="block appearance-none w-full bg-white border border-blueColor text-bodyColor py-2 md:px-6 md:pr-24 px-4 pr-8 rounded-full leading-tight focus:outline-none focus:bg-white focus:border-blueColor"
                  >
                    <option value="">Select jurisdiction</option>
                    {subCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <IoMdArrowDropdown className="text-2xl text-blueColor" />
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleAddArea}
              className="mt-5 py-1 px-4 w-fit h-fit bg-blueColor rounded-full font-semibold border-transparent border-2 text-white hover:bg-blueHover"
            >
              Add area
            </button>
          </>
        </Modal>

        {/* {userDetails?.subscription_type == "BUDGET" && (
            <>
              <p className="text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor">
                Your plan includes 1 coverage area which is already in use. If
                you would like to set up a new coverage area, please remove the
                other one or{" "}
                <a className="text-blueColor font-semibold underline hover:no-underline">
                  upgrade your plan{" "}
                </a>{" "}
                to increase the number of coverage areas you can track.
              </p>
              <button className="mt-5 py-1 px-4 w-fit h-fit bg-blueColor rounded-full font-semibold border-transparent border-2 text-white hover:bg-blueHover">
                Go back
              </button>
            </>
          )} */}
        <Modal
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%]  md:w-[50%] py-16 px-10 bg-white shadow-sm outline-none border rounded-3xl"
          isOpen={isChannelLimitReachedModalOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={handleCloseLimitReachedModal}
          style={customStyles}
          contentLabel="Delete Confirmation Modal"
        >
          <div
            onClick={handleCloseLimitReachedModal}
            className="absolute top-3  cursor-pointer right-5"
          >
            <button className=" text-iota text-4xl font-bold">
              <IoCloseSharp />
            </button>
          </div>

          <p className="text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor">
            Your plan includes {userDetails.subscriptionDetails.channels_limit} coverage {userDetails.subscriptionDetails.channels_limit > 1 ? "areas" : "area"} which is already in use. If
            you would like to set up a new coverage area, please remove the
            other one or{" "}
            <a className="text-blueColor font-semibold underline hover:no-underline">
              upgrade your plan{" "}
            </a>{" "}
            to increase the number of coverage areas you can track.
          </p>
          <button onClick={handleCloseLimitReachedModal} className="mt-5 py-1 px-4 w-fit h-fit bg-blueColor rounded-full font-semibold border-transparent border-2 text-white hover:bg-blueHover">
            Go back
          </button>
        </Modal>
        {/* {userDetails?.subscription_type == "PLUS" && (
            <>
              <p className="text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor">
                Your plan includes 2 coverage areas which are already in use. If
                you would like to set up a new coverage area, please remove
                existing one(s) or{" "}
                <a className="text-blueColor font-semibold underline hover:no-underline">
                  upgrade your plan{" "}
                </a>{" "}
                to increase the number of coverage areas you can track.
              </p>
              <button className="mt-5 py-1 px-4 w-fit h-fit bg-blueColor rounded-full font-semibold border-transparent border-2 text-white hover:bg-blueHover">
                Go back
              </button>
            </>
          )} */}
      </div>
    </>
  );
}
