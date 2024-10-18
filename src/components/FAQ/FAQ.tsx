"use client";
import React, { useState } from "react";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What time will end-of-day alerts arrive in my email inbox?",
      answer: (
        <>
          End-of-day email alerts typically arrive between 5-6 PM. However, they
          may come later depending on when the sessions for the day end in the
          jurisdictions you are tracking.
        </>
      ),
    },
    {
      question: "How quickly will a real-time alert arrive in my email inbox?",
      answer: (
        <>
          Real-time alerts will arrive 1-3 minutes after the mention. Please
          note real-time alerts are only available for those on our Pro
          Plan.Learn more about our plans and pricing.
        </>
      ),
    },
    {
      question: "How come I didn’t receive an email alert?",
      answer: (
        <>
          You will only receive alerts if your keyword(s) is mentioned within
          the context of the designated coverage area.
        </>
      ),
    },
    {
      question: "Why else could I not be receiving email alerts?",
      answer: (
        <>
          Our email notifications can get blocked by spam filters or security
          settings. To ensure delivery, add{" "}
          <span className="text-blueColor underline hover:no-underline hover:text-blueHover">
            alerts@polialerts.com
          </span>{" "}
          to your email whitelist or contact book.
        </>
      ),
    },
    {
      question: "How come I can’t find a specific jurisdiction?",
      answer: (
        <>
          At this time we are covering most major jurisdictions in Canada across
          federal, provincial, and municipal levels. We are adding more all the
          time. If there is a specific jurisdiction you would like to track,
          please email us at{" "}
          <a
            href=""
            className="text-blueColor underline hover:no-underline hover:text-blueHover"
          >
            info@polialerts.com
          </a>{" "}
          to see if it can be made available.
        </>
      ),
    },
    {
      question: "What types of government sessions are covered by PoliAlerts?",
      answer: (
        <>
          PoliAlerts covers a variety of government sessions including
          broadcasted federal, provincial, and municipal hearings, debates, and
          committee meetings. We are continuously expanding our coverage to
          include more sessions.
        </>
      ),
    },
    {
      question: "How do I upgrade to the Pro Plan?",
      answer: (
        <>
          To upgrade to the Pro Plan, please contact us at{" "}
          <a
            href=""
            className="text-blueColor underline hover:no-underline hover:text-blueHover"
          >
            info@polialerts.com
          </a>
          .
        </>
      ),
    },
    {
      question: "How do I change my email address for alerts?",
      answer: (
        <>
          To change your email address for alerts, navigate to your dashboard
          and edit the “Recipient” section for your desired coverage area. You
          may specify different recipients across coverage areas. Make sure to
          save your changes to confirm any changes you make.
        </>
      ),
    },
    {
      question: "Can I customize the keywords for my alerts?",
      answer: (
        <>
          Yes, you can add, remove or modify keywords at any time through your
          account dashboard. Just navigate to your dashboard and click the “Edit
          or remove” button under a coverage area. For optimal results, choose
          specific and relevant keywords.
        </>
      ),
    },
    {
      question: "What is quote context?",
      answer: (
        <>
          Quote context refers to the number of words quoted before and after
          each keyword in your alert emails. For higher context, select a higher
          number and receive a larger snippet of the conversation in your alert
          email. On our Pro Plan, you will have access to full transcripts
          linked from your alert emails.
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="md:my-5 my-3 rounded-xl bg-lightGray md:p-10 p-3">
        {faqs.map((faq, index) => (
          <section className="my-2" key={index}>
            <div
              className="accordion flex items-center justify-between border-b border-b-iota cursor-pointer"
              onClick={() => toggleAccordion(index)}
            >
              <p className="font-bold text-[1.375rem] leading-[1.875rem] md:text-[1.625rem] md:leading-[2.375rem] py-6 text-headingColor">
                {faq.question}
              </p>
              <p className="px-1 md:text-5xl text-3xl text-blueColor font-bold">
                {activeIndex === index ? "-" : "+"}
              </p>
            </div>
            {activeIndex === index && (
              <div className="panel py-3 text-bodyColor text-sm leading-[1.375rem] md:text-base md:leading-7">
                {faq.answer}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
