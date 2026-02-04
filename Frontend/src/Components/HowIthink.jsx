import React from "react";
import { motion } from "framer-motion";
import {
  leftVariant,
  rightVariant,
  mobileVariant,
  dotVariant,
} from "./animations";

const TimelineItem = ({ side = "left", children }) => {
  const isLeft = side === "left";

  return (
    <div className="relative flex">
      {/* Dot */}
      <motion.div
        variants={dotVariant}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.3 }}
        className="
          absolute
          left-4 md:left-1/2
          md:-translate-x-1/2
          w-3 h-3 md:w-4 md:h-4
          rounded-full bg-indigo-600
        "
      />

      {/* Card */}
      <motion.div
        variants={isLeft ? leftVariant : rightVariant}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`
          w-full
          md:w-1/2
          ml-10 md:ml-0
          ${isLeft ? "md:pr-12" : "md:ml-auto md:pl-12"}
        `}
      >
        <motion.div
          variants={mobileVariant}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

const HowIThink = () => {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-24">
          <p className="text-sm tracking-widest text-indigo-600 mb-2">
            CHAPTER 1
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            How I Think
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">

          {/* Vertical Line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="
              absolute
              left-4 md:left-1/2
              top-0
              h-full
              w-[2px]
              bg-gray-200
              origin-top
            "
          />

          <div className="space-y-24 md:space-y-32">

            {/* ITEM 1 */}
            <TimelineItem side="left">
              <h3 className="font-semibold text-lg">
                Foundation <span className="text-green-600 text-sm">(Completed)</span>
              </h3>
              <p className="text-indigo-600 text-sm mb-2">Building the Base</p>
              <p className="text-gray-600">
                Mastering Data Structures & Algorithms using C++ and Java
                to build strong problem-solving fundamentals.
              </p>
            </TimelineItem>

            {/* ITEM 2 */}
            <TimelineItem side="right">
              <h3 className="font-semibold text-lg">
                Frontend Focus <span className="text-indigo-600 text-sm">(In Progress)</span>
              </h3>
              <p className="text-indigo-600 text-sm mb-2">Crafting Interfaces</p>
              <p className="text-gray-600">
                Building accessible, responsive, and performant interfaces
                using React and modern frontend tools.
              </p>
            </TimelineItem>

            {/* ITEM 3 */}
            <TimelineItem side="left">
              <h3 className="font-semibold text-lg">
                Full Stack <span className="text-gray-500 text-sm">(Upcoming)</span>
              </h3>
              <p className="text-indigo-600 text-sm mb-2">Expanding Horizons</p>
              <p className="text-gray-600">
                Designing scalable backend systems, APIs, and databases
                with clean architecture principles.
              </p>
            </TimelineItem>

            {/* ITEM 4 */}
            <TimelineItem side="right">
              <h3 className="font-semibold text-lg">
                Problem Solving & System Thinking{" "}
                <span className="text-indigo-600 text-sm">(Ongoing)</span>
              </h3>
              <p className="text-indigo-600 text-sm mb-2">
                Thinking in Constraints
              </p>
              <p className="text-gray-600">
                Solving critical problems on LeetCode while developing
                a strong system-level mindset.
              </p>
            </TimelineItem>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HowIThink;