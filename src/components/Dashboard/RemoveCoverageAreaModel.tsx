"use client";
import { useState } from "react";
import Modal from "react-modal";
import Close from "@/components/Icons/Close";
import Warning from "@/components/Icons/Warning";

interface IRemoveCoverageAreaModelProps {
  handleRemoveChannel: () => void;
}

export default function RemoveCoverageAreaModel({ handleRemoveChannel }: IRemoveCoverageAreaModelProps) {
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
  };

  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  function openModal() {
    setIsOpen(true);
  }
  function afterOpenModal() { }
  function closeModal() {
    setIsOpen(false);
  }

  const handleRemoveCoverageArea = () => {
    console.log("Remove Coverage Area");
    handleRemoveChannel();
    closeModal();
  }

  return (
    <>
      <div>
        <div onClick={openModal} className="cursor-pointer font-Manrope">
          <button className="py-1 px-4 w-fit h-fit border-blueColor text-base font-semibold border-2 rounded-full text-blueColor">
            Remove area
          </button>
        </div>
        <Modal
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[50%] py-16 px-10 bg-white shadow-sm outline-none border rounded-3xl"
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Delete Confirmation Modal"
        >
          <div
            onClick={closeModal}
            className="absolute top-3 cursor-pointer right-5"
          >
            <Close />
          </div>

          <div className="font-semibold text-xl">
            <div className="flex gap-3 items-center">
              <Warning />
              <h3 className="text-headingColor font-bold text-[1.375rem] leading-[1.875rem] md:text-[1.625rem] md:leading-[2.375rem]">
                Remove coverage area
              </h3>
            </div>
          </div>
          <p className="my-5 text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor">
            Warning: removing a coverage area will permanently delete all of your keyword selections. <span className="text-warn text-base">This cannot be undone.</span>
          </p>

          <p className="text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor my-5">Are you sure you want to continue?</p>
          <button onClick={handleRemoveCoverageArea} className="py-2 px-4 w-fit h-fit bg-blueColor rounded-full font-semibold border-transparent border-2 text-base text-white hover:bg-blueHover">
            Remove area permanently
          </button>

        </Modal>
      </div>
    </>
  );
}
