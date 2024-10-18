"use client";
import React, { useState, useEffect } from "react";
import Speed from "@/components/Icons/Speed";
import Calendar from "@/components/Icons/Calendar";
import Quote from "@/components/Icons/Quote";
import Email from "@/components/Icons/Email";
import { IoCloseSharp } from "react-icons/io5";
import { useMediaQuery } from "react-responsive";
import { Channel, User } from "@/types";
import RemoveCoverageAreaModel from "@/components/Dashboard/RemoveCoverageAreaModel";

interface ICoverageAreaProps {
  channel: Channel;
  channelId: string;
  updateChannel: (channelId: string, updatedChannel: Channel) => void;
  deleteChannel: (channelId: string) => void;
  userDetails: User;
  fetchUser: (userId: string) => void;
  subscriptionType: string;
}

export default function CoverageArea({
  channel,
  channelId,
  updateChannel,
  deleteChannel,
  userDetails,
  fetchUser,
  subscriptionType,
}: ICoverageAreaProps) {

  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // State to manage real-time alert keyword input
  const [realTimeAlertKeyword, setRealTimeAlertKeyword] = useState<string>("");

  // State to manage real-time alert keywords
  const [realTimeAlertKeywords, setRealTimeAlertKeywords] = useState<string[]>(
    []
  );

  // State to manage report alert keyword input
  const [reportAlertKeyword, setReportAlertKeyword] = useState<string>("");

  // State to manage report alert keywords (End of day Email Alerts)
  const [reportAlertKeywords, setReportAlertKeywords] = useState<string[]>([]);

  // State to manage quote context
  const [quoteContext, setQuoteContext] = useState<number>(0);

  // State to manage recipients input
  const [recipient, setRecipient] = useState<string>("");

  // State to manage recipients
  const [recipients, setRecipients] = useState<string[]>([]);

  // State to manage limit of report Alert Keywords (End of Day Alert keywords)
  const [isReportAlertLimitReached, setIsReportAlertLimitReached] =
    useState<boolean>(false);

  // State to manage limit of recipients
  const [isRecipientLimitReached, setIsRecipientLimitReached] =
    useState<boolean>(false);

  const [showRightSide, setShowRightSide] = useState<boolean>(false);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  useEffect(() => {
    setRealTimeAlertKeywords(channel.real_time_alert_keywords);
    setReportAlertKeywords(channel.report_alert_keywords);
    setRecipients(channel.recipients);
    setQuoteContext(channel.quote_context);

    // if report alert keywords limit reached
    if (
      channel.report_alert_keywords.length >=
      userDetails.subscriptionDetails.report_alert_keywords_limit
    ) {
      setIsReportAlertLimitReached(true);
    }

    // if recipients limit reached
    if (
      channel.recipients.length >=
      userDetails.subscriptionDetails.recipients_limit
    ) {
      setIsRecipientLimitReached(true);
    }
  }, [channel]);

  const toggleRightSide = () => {
    setShowRightSide(!showRightSide);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Function to handle adding real-time alert keyword
  const handleAddRealTimeAlertKeyword = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {

      if (!realTimeAlertKeyword) return;

      // Check if already exists
      if (realTimeAlertKeywords.includes(realTimeAlertKeyword)) {
        return;
      }

      setRealTimeAlertKeyword("");
      setRealTimeAlertKeywords([...realTimeAlertKeywords, realTimeAlertKeyword]);
      // addRealTimeAlertKeyword(channelId, realTimeAlertKeyword);

      setRealTimeAlertKeyword("");
    }
    catch (err) {
      console.log("Error adding real-time alert keyword: ", err);
    }
  };

  // Function to handle removing real-time alert keyword
  const handleRemoveRealTimeAlertKeyword = (keyword: string) => {
    const updatedKeywords = realTimeAlertKeywords.filter((k) => k !== keyword);
    setRealTimeAlertKeywords(updatedKeywords);
  };

  // Function to handle adding report alert keyword
  const handleAddReportAlertKeyword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {

      if (!reportAlertKeyword) return;

      // Check if already exists
      if (reportAlertKeywords.includes(reportAlertKeyword)) {
        return;
      }

      const newReportAlertKeywordsArray = [...reportAlertKeywords, reportAlertKeyword]

      // Limit Reached!
      if (
        newReportAlertKeywordsArray.length >=
        userDetails.subscriptionDetails.report_alert_keywords_limit
      ) {
        setIsReportAlertLimitReached(true);
      }

      setReportAlertKeyword("");
      setReportAlertKeywords(newReportAlertKeywordsArray);

    } catch (err) {
      console.log("Error adding report alert keyword: ", err);
    }
  };

  // Function to handle removing report alert keyword
  const handleRemoveReportAlertKeyword = (keyword: string) => {
    const updatedKeywords = reportAlertKeywords.filter((k) => k !== keyword);

    // Reset the disable feature
    if (
      updatedKeywords.length <
      userDetails.subscriptionDetails.report_alert_keywords_limit
    ) {
      setIsReportAlertLimitReached(false);
    }

    setReportAlertKeywords(updatedKeywords);
  };

  // Function to handle adding recipient
  const handleAddRecipient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!recipient) return;

      // Check if already exists
      if (recipients.includes(recipient)) {
        return;
      }

      const newRecipients = [...recipients, recipient];

      // Limit Reached!
      if (
        newRecipients.length >= userDetails.subscriptionDetails.recipients_limit
      ) {
        setIsRecipientLimitReached(true);
      }

      setRecipient("");
      setRecipients([...recipients, recipient]);
    }
    catch (err) {
      console.log("Error adding recipient: ", err);
    }

  };

  // Function to handle removing recipient
  const handleRemoveRecipient = (recipient: string) => {
    const updatedRecipients = recipients.filter((r) => r !== recipient);
    if (
      updatedRecipients.length <
      userDetails.subscriptionDetails.recipients_limit
    ) {
      setIsRecipientLimitReached(false);
    }
    setRecipients(updatedRecipients);
  };

  // Method to Update Channel
  const handleUpdateChannel = async () => {
    setIsEditMode(false);

    await updateChannel(channelId, {
      ...channel,
      real_time_alert_keywords: realTimeAlertKeywords,
      report_alert_keywords: reportAlertKeywords,
      recipients: recipients,
      quote_context: quoteContext,
    });

    console.log("Channel Updated Successfully! - 2");
    if (!userDetails.id) throw new Error("User not found.");
    fetchUser(userDetails.id);
  };

  // Method to Revert Changes
  const handleRevertChannel = () => {
    console.log("Reverting changes...");
    setRealTimeAlertKeywords(channel.real_time_alert_keywords);
    setReportAlertKeywords(channel.report_alert_keywords);
    setRecipients(channel.recipients);
    setQuoteContext(channel.quote_context);
    setIsEditMode(false);
  };

  // Method to handle removing coverage area
  const handleRemoveChannel = async () => {
    await deleteChannel(channelId);
    if (!userDetails.id) throw new Error("User not found.");
    fetchUser(userDetails.id);
  };

  return (
    <>
      <section className="lg:pl-24 lg:pr-[4.70rem] md:px-10 px-5 py-5 md:py-10 md:gap-5 gap-5 md:flex-row flex-col flex md:justify-between md:items-start">
        <div className="flex w-full md:flex-row flex-col gap-5">
          {/* left side */}
          <div className="md:w-[30%] w-full flex justify-between md:items-start items-center">
            <div className="flex flex-col gap-3">
              <p className="uppercase text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor">
                {channel.main_category}
              </p>
              <h3 className="font-bold text-headingColor text-[1.375rem] leading-[1.875rem] md:text-[1.625rem] md:leading-[2.375rem]">
                {channel.sub_category}
              </h3>

              {(!isMobile || showRightSide) && !isEditMode && (
                <button
                  onClick={toggleEditMode}
                  className="my-3 py-1 px-4 w-fit h-fit bg-blueColor rounded-full font-semibold text-base border-transparent border-2 text-white hover:bg-blueHover"
                >
                  Edit or remove
                </button>
              )}

              {(!isMobile || showRightSide) && isEditMode && (
                <div className="my-3">
                  <RemoveCoverageAreaModel
                    handleRemoveChannel={handleRemoveChannel}
                  />
                </div>
              )}
            </div>

            {isMobile && (
              <button
                onClick={toggleRightSide}
                className={`text-blueColor ${showRightSide ? "text-7xl" : "text-5xl"} ${showRightSide ? "-mt-14" : "-mt-0"}`}
              >
                {showRightSide ? "-" : "+"}
              </button>
            )}
          </div>

          {/* right-side */}

          <div className="md:w-[70%] w-full">
            {(showRightSide || !isMobile) && (
              <div>
                {/* Pro Plan*/}
                {subscriptionType == "PRO" && (
                  <>
                    <div>
                      <div className="flex md:flex-row flex-col md:gap-10 gap-5 mb-5">
                        <div className="md:w-[50%] w-full">
                          <div className="flex items-center gap-2 my-5">
                            <Speed />
                            <h3 className="ml-3 font-bold text-headingColor text-[1.375rem] leading-[1.875rem] md:text-[1.625rem] md:leading-[2.375rem]">
                              Real-time email alerts
                            </h3>
                          </div>

                          {isEditMode && (
                            <div>
                              <form
                                onSubmit={handleAddRealTimeAlertKeyword}
                                className="flex flex-row gap-5 md:gap-2 my-5"
                              >
                                <input
                                  value={realTimeAlertKeyword}
                                  onChange={(e) =>
                                    setRealTimeAlertKeyword(e.target.value)
                                  }
                                  required
                                  type="text"
                                  className="rounded-full border h-fit border-blueColor outline-none w-full  py-1 px-3"
                                  placeholder="Add keywords here"
                                />
                                <button
                                  type="submit"
                                  className="inline py-1 px-5 w-fit h-fit bg-blueColor rounded-full text-base font-semibold border-transparent border-2 text-white"
                                >
                                  Add
                                </button>
                              </form>
                            </div>
                          )}

                          <div className="bg-lightGray pr-6 rounded-xl h-fit py-5 pl-5 md:pr-7">
                            <div className="bg-lightGray w-full rounded-xl customScrollbar overflow-auto h-[30vh] md:h-[50vh]">
                              {realTimeAlertKeywords.length > 0 ? (
                                realTimeAlertKeywords.map((keyword, index) => (
                                  <div
                                    key={index}
                                    className="bg-white flex items-center my-5 text-bodyColor py-1 px-2 w-fit rounded-lg text-sm leading-[1.375rem] md:text-base md:leading-7"
                                  >
                                    {keyword}
                                    {isEditMode && (
                                      <button
                                        className="mx-2 text-iota text-3xl"
                                        onClick={() =>
                                          handleRemoveRealTimeAlertKeyword(
                                            keyword
                                          )
                                        }
                                      >
                                        <IoCloseSharp />
                                      </button>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <p className="text-bodyColor text-sm leading-[1.375rem] md:text-base md:leading-7">
                                  No keywords found
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        
                     {/*  <div className="md:w-[50%] w-full">
                          <div className="flex items-center gap-2 my-5">
                            <Calendar />
                            <h3 className="ml-3 font-bold text-headingColor text-[1.375rem] leading-[1.875rem] md:text-[1.625rem] md:leading-[2.375rem]">
                              End-of-day email alerts
                            </h3>
                          </div>

                          {isEditMode && (
                            <div>
                              <form
                                onSubmit={handleAddReportAlertKeyword}
                                className="flex gap-5 md:gap-2 my-5"
                              >
                                <input
                                  value={reportAlertKeyword}
                                  onChange={(e) =>
                                    setReportAlertKeyword(e.target.value)
                                  }
                                  required
                                  type="text"
                                  className="rounded-full border h-fit border-blueColor outline-none w-full py-1 px-3"
                                  placeholder="Add keywords here"
                                />
                                <button
                                  type="submit"
                                  className="py-1 px-5 w-fit  h-fit  bg-blueColor  rounded-full text-base font-semibold border-transparent border-2 text-white hover:bg-blueHover"
                                >
                                  Add
                                </button>
                              </form>
                            </div>
                          )}

                          <div className="bg-lightGray pr-6 rounded-xl h-fit py-5 pl-5 md:pr-7">
                            <div className="bg-lightGray w-full rounded-xl customScrollbar overflow-auto h-[30vh] md:h-[50vh]">
                              {/*{channel.report_alert_keywords.map((keyword, index) => (
                          <div
                            key={index}
                            className="bg-white flex items-center my-5 text-bodyColor py-1 px-2 w-fit rounded-lg"
                          >
                            {keyword}
                            {isEditMode && (
                              <button className="mx-2 text-iota text-3xl">
                                <IoCloseSharp />
                              </button>
                            )}
                          </div>
                        ))}*/}
                        {/*}
                              {reportAlertKeywords.length > 0 ? (
                                reportAlertKeywords.map((keyword, index) => (
                                  <div
                                    key={index}
                                    className="bg-white flex items-center my-5 text-bodyColor py-1 px-2 w-fit rounded-lg text-sm leading-[1.375rem] md:text-base md:leading-7"
                                  >
                                    {keyword}
                                    {isEditMode && (
                                      <button
                                        onClick={() =>
                                          handleRemoveReportAlertKeyword(
                                            keyword
                                          )
                                        }
                                        className="mx-2 text-iota text-3xl"
                                      >
                                        <IoCloseSharp />
                                      </button>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <p className="text-bodyColor text-sm leading-[1.375rem] md:text-base md:leading-7">
                                  No keywords found
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        */}
                        
                      </div>

                      {/* Quotes */}
                      <div className="flex md:flex-row flex-col md:items-center gap-5 my-5 mt-10">
                        {/* right */}
                        <div className="md-w-[50%] w-full">
                          <div className="flex items-center gap-2 my-5">
                            <Quote />
                            {isEditMode ? (
                              <h3 className="ml-3 font-bold text-headingColor text-[1.375rem] leading-[1.875rem] md:text-[1.625rem] md:leading-[2.375rem]">
                                Quote Context
                              </h3>
                            ) : (
                              <h3 className="ml-3 font-bold text-headingColor text-[1.375rem] leading-[1.875rem] md:text-[1.625rem] md:leading-[2.375rem]">
                                Quote Context : {quoteContext} words
                              </h3>
                            )}
                          </div>

                          {isEditMode && (
                            <>
                              <p className="block mb-2 text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor">
                                Use the slider to control how many words are
                                quoted before and after each keyword in your
                                alert emails
                              </p>
                            </>
                          )}
                        </div>
                        {/* left */}
                        {isEditMode && (
                          <div className="md-w-[50%] w-full">
                            <div className="flex items-center bg-lightGray rounded-full space-x-4 px-4 py-2">
                              <span className="text-lg font-semibold">
                                {quoteContext}{" "}
                              </span>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={quoteContext}
                                onChange={(e) =>
                                  setQuoteContext(parseInt(e.target.value))
                                }
                                className="appearance-none w-full h-2 rounded-full bg-gray-200"
                                style={{
                                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${quoteContext}%, #e5e7eb ${quoteContext}%, #e5e7eb 100%)`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      {/* recipients */}
                      <div className="flex items-center gap-2 my-5 mt-10">
                        <Email />
                        <h3 className="ml-3 font-bold text-headingColor text-[1.375rem] leading-[1.875rem] md:text-[1.625rem] md:leading-[2.375rem]">
                          Recipients
                        </h3>
                      </div>
                      {isEditMode && (
                        <div>
                          <form
                            onSubmit={handleAddRecipient}
                            className="flex gap-5 md:gap-2"
                          >
                            <input
                              value={recipient}
                              onChange={(e) => setRecipient(e.target.value)}
                              required
                              name="first-name"
                              type="text"
                              className="rounded-full border h-fit border-blueColor outline-none w-full md:w-[40%] py-1 px-3"
                              placeholder="Enter new email address"
                            />
                            <button
                              type="submit"
                              className="py-1 px-5 w-fit h-fit bg-blueColor rounded-full text-base font-semibold border-transparent border-2 text-white"
                            >
                              Add
                            </button>
                          </form>
                        </div>
                      )}

                      {/* email container */}
                      <div className="flex flex-wrap gap-2 bg-lightGray md:p-10 p-5 rounded-2xl w-full my-5">
                        {recipients?.length > 0 ? (
                          recipients.map((recipient, index) => (
                            <div
                              className="bg-white flex items-center rounded-md py-1 px-2 text-sm leading-[1.375rem] md:text-base md:leading-7"
                              key={index}
                            >
                              {recipient}
                              {isEditMode && (
                                <button
                                  onClick={() =>
                                    handleRemoveRecipient(recipient)
                                  }
                                  className="mx-2 text-iota text-3xl"
                                >
                                  <IoCloseSharp />
                                </button>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-bodyColor text-sm leading-[1.375rem] md:text-base md:leading-7">
                            No recipient found
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Budget and plus plan */}
                {(subscriptionType === "BUDGET" ||
                  subscriptionType === "PLUS") && (
                  <>
                    <div>
                      <div className="flex items-center gap-2">
                        <Calendar />
                        <h3 className="ml-3 font-bold text-headingColor text-[1.375rem] leading-[1.875rem] md:text-[1.625rem] md:leading-[2.375rem]">
                          End-of-day email alerts
                        </h3>
                      </div>

                      <div
                        className={`flex ${isEditMode ? "md:flex-row flex-col" : "flex-col"}  md:gap-10 gap-5 ${isEditMode ? "my-5" : "my-0"}`}
                      >
                        <div className="md:w-[50%] w-full">
                          {isEditMode && (
                            <div>
                              <form
                                onSubmit={handleAddReportAlertKeyword}
                                className="flex gap-5 md:gap-2"
                              >
                                <input
                                  value={reportAlertKeyword}
                                  onChange={(e) =>
                                    setReportAlertKeyword(e.target.value)
                                  }
                                  required
                                  type="text"
                                  className={`rounded-full border h-fit outline-none w-full py-1 px-3 ${
                                    isReportAlertLimitReached
                                      ? "border-red-500"
                                      : "border-blueColor"
                                  }`}
                                  placeholder={
                                    isRecipientLimitReached
                                      ? "Keyword limit reached"
                                      : "Add keywords here"
                                  }
                                  disabled={isReportAlertLimitReached}
                                />
                                <button
                                  type="submit"
                                  className={`py-1 px-5 w-fit h-fit rounded-full text-base font-semibold border-transparent border-2 text-white ${
                                    isReportAlertLimitReached
                                      ? "bg-blueHover cursor-not-allowed"
                                      : "bg-blueColor hover:bg-blueHover"
                                  }`}
                                  disabled={isReportAlertLimitReached}
                                >
                                  Add
                                </button>
                              </form>
                            </div>
                          )}
                        </div>

                        <div className="bg-lightGray pr-6 rounded-3xl h-fit py-5 pl-5 md:pr-7 md:w-[50%] w-full">
                          <div
                            className={`bg-lightGray w-full rounded-xl customScrollbar overflow-auto ${subscriptionType == "BUDGET" ? "md:h-[30vh] h-[15vh]" : "md:h-[60vh] h-[40vh]"}`}
                          >
                            {reportAlertKeywords.length > 0 ? (
                              reportAlertKeywords.map((keyword, index) => (
                                <div
                                  key={index}
                                  className="bg-white flex items-center my-5 text-bodyColor py-1 px-2 w-fit rounded-lg text-sm leading-[1.375rem] md:text-base md:leading-7"
                                >
                                  {keyword}
                                  {isEditMode && (
                                    <button
                                      onClick={() =>
                                        handleRemoveReportAlertKeyword(keyword)
                                      }
                                      className="mx-2 text-iota text-3xl"
                                    >
                                      <IoCloseSharp />
                                    </button>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className="text-bodyColor text-sm leading-[1.375rem] md:text-base md:leading-7">
                                No keywords found
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quotes */}
                      <div className="flex md:flex-row flex-col md:items-center gap-5 my-5 mt-10">
                        <div className="md-w-[50%] w-full">
                          <div className="flex items-center gap-2 my-5">
                            <Quote />
                            {isEditMode ? (
                              <h3 className="ml-3 font-bold text-headingColor text-[1.375rem] leading-[1.875rem] md:text-[1.625rem] md:leading-[2.375rem]">
                                Quote Context
                              </h3>
                            ) : (
                              <h3 className="ml-3 font-bold text-headingColor text-[1.375rem] leading-[1.875rem] md:text-[1.625rem] md:leading-[2.375rem]">
                                Quote Context : {quoteContext} words
                              </h3>
                            )}
                          </div>

                          {isEditMode && (
                            <>
                              <p className="block mb-2 text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor">
                                Use the slider to control how many words are
                                quoted before and after each keyword in your
                                alert emails
                              </p>
                            </>
                          )}
                        </div>
                        {/* left */}
                        {isEditMode && (
                          <div className="md-w-[50%] w-full">
                            <div className="flex items-center bg-lightGray rounded-full space-x-4 px-4 py-2">
                              <span className="text-lg font-semibold">
                                {quoteContext}{" "}
                              </span>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={quoteContext}
                                onChange={(e) =>
                                  setQuoteContext(parseInt(e.target.value))
                                }
                                className="appearance-none w-full h-2 rounded-full bg-gray-200"
                                style={{
                                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${quoteContext}%, #e5e7eb ${quoteContext}%, #e5e7eb 100%)`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* recipients */}
                      <div className="flex items-center gap-2 mt-10">
                        <Email />
                        <h3 className="ml-3 font-bold text-headingColor text-[1.375rem] leading-[1.875rem] md:text-[1.625rem] md:leading-[2.375rem]">
                          Recipients
                        </h3>
                      </div>

                      <div
                        className={`flex ${isEditMode ? "md:flex-row flex-col" : "flex-col"} md:gap-10 gap-5 ${isEditMode ? "my-5" : "my-0"}`}
                      >
                        <div className="md:w-[50%] w-full">
                          {isEditMode && (
                            <div>
                              <form
                                onSubmit={handleAddRecipient}
                                className="flex gap-5 md:gap-2"
                              >
                                <input
                                  value={recipient}
                                  onChange={(e) => setRecipient(e.target.value)}
                                  required
                                  name="first-name"
                                  type="text"
                                  className={`rounded-full border h-fit outline-none w-full py-1 px-3 ${
                                    isRecipientLimitReached
                                      ? "border-red-500"
                                      : "border-blueColor"
                                  }`}
                                  placeholder={
                                    isRecipientLimitReached
                                      ? "Keyword limit reached"
                                      : "Enter new email address"
                                  }
                                  disabled={isRecipientLimitReached}
                                />
                                <button
                                  type="submit"
                                  className={`py-1 px-5 w-fit h-fit rounded-full text-base font-semibold border-transparent border-2 text-white ${
                                    isRecipientLimitReached
                                      ? "bg-blueHover cursor-not-allowed"
                                      : "bg-blueColor hover:bg-blueHover"
                                  }`}
                                  disabled={isRecipientLimitReached}
                                >
                                  Add
                                </button>
                              </form>
                            </div>
                          )}
                        </div>

                        <div className={`flex flex-wrap gap-2 bg-lightGray rounded-2xl md:w-[50%] w-full ${subscriptionType == "BUDGET" ? "p-5" : "p-10"}`}>
                          {recipients?.length > 0 ? (
                            recipients.map((recipient, index) => (
                              <div
                                className="bg-white flex items-center rounded-md py-1 px-2 text-sm leading-[1.375rem] md:text-base md:leading-7"
                                key={index}
                              >
                                {recipient}
                                {isEditMode && (
                                  <button
                                    onClick={() =>
                                      handleRemoveRecipient(recipient)
                                    }
                                    className="mx-2 text-iota text-3xl"
                                  >
                                    <IoCloseSharp />
                                  </button>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-bodyColor text-sm leading-[1.375rem] md:text-base md:leading-7">
                              No recipient found
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {isEditMode && (
                  <>
                    <p className="block mb-2 text-sm leading-[1.375rem] md:text-base md:leading-7 text-bodyColor">
                      Changes made above are not saved until you confirm with
                      &quot;save changes&quot; button
                    </p>

                    <div className="flex flex-col md:flex-row gap-5 my-5">
                      <button
                        type="submit"
                        onClick={() => handleUpdateChannel()}
                        className="py-2 px-8 w-fit h-fit bg-blueColor rounded-full text-base font-semibold border-transparent border-2 text-white hover:bg-blueHover"
                      >
                        Save changes
                      </button>
                      <button
                        onClick={() => handleRevertChannel()}
                        className="py-2 px-5 w-fit h-fit border-blueColor text-base font-semibold border-2 rounded-full text-blueColor"
                      >
                        Revert
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
