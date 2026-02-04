import React from "react";
import { motion } from "framer-motion";
import {
  leftVariant,
  rightVariant,
  mobileVariant,
  dotVariant,
  containerVariant,
  textVariant,
} from "./animations";

const TimelineItem = ({ side = "left", children }) => {
  const isLeft = side === "left";

  return (
    <div className="relative flex">
      {/* Dot */}
      <motion.div
        variants={dotVariant}
        initial="hidden"
        whileInView={{
          scale: [1, 1.6, 1],
          boxShadow: "0 0 0 6px rgba(99,102,241,0.15)",
        }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="
          absolute left-4 md:left-1/2
          md:-translate-x-1/2
          w-3 h-3 md:w-4 md:h-4
          rounded-full bg-indigo-600
        "
      />

      {/* Card Wrapper */}
      <motion.div
        variants={isLeft ? leftVariant : rightVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className={`
          w-full md:w-1/2
          ml-10 md:ml-0
          ${isLeft ? "md:pr-12" : "md:ml-auto md:pl-12"}
        `}
      >
        {/* Card */}
        <motion.div
          variants={mobileVariant}
          initial="hidden"
          whileInView="visible"
          whileHover={{
            y: -6,
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          }}
          transition={{ duration: 0.25 }}
          className="
            bg-white p-6 rounded-xl
            border border-gray-200
            relative overflow-hidden
          "
        >
          {/* subtle gradient edge */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />

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
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="text-sm tracking-widest text-indigo-600 mb-2"
          >
            CHAPTER 1
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900"
          >
            How I Think
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="relative">

          {/* Vertical Line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            viewport={{ once: true }}
            className="
              absolute left-4 md:left-1/2
              top-0 h-full w-[2px]
              bg-gradient-to-b from-indigo-500/40 to-gray-200
              origin-top
            "
          />

          <motion.div
            variants={containerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-24 md:space-y-32"
          >

            {/* ITEM 1 */}
            <TimelineItem side="left">
              <motion.h3 variants={textVariant} className="font-semibold text-lg">
                Foundation 
              </motion.h3>
              <motion.p variants={textVariant} className="text-indigo-600 text-sm mb-2">
                Building the Base
              </motion.p>
              <motion.p variants={textVariant} className="text-gray-600">
                Mastering Data Structures & Algorithms using C++ and Java
                to build strong problem-solving fundamentals.
              </motion.p>
            </TimelineItem>

            {/* ITEM 2 */}
            <TimelineItem side="right">
              <motion.h3 variants={textVariant} className="font-semibold text-lg">
                Full Stack
              </motion.h3>
              <motion.p variants={textVariant} className="text-indigo-600 text-sm mb-2">
                Expanding Horizons
              </motion.p>
              <motion.p variants={textVariant} className="text-gray-600">
                Designing scalable backend systems, APIs, and databases
                with clean architecture principles.
              </motion.p>
            </TimelineItem>

            {/* ITEM 3 */}
            <TimelineItem side="left">
              <motion.h3 variants={textVariant} className="font-semibold text-lg">
                GEN AI
              </motion.h3>
              <motion.p variants={textVariant} className="text-indigo-600 text-sm mb-2">
                From Models to Meaning
              </motion.p>
              <motion.p variants={textVariant} className="text-gray-600">
                Learning the fundamentals of Generative AI, including LLM concepts,
                prompt engineering, embeddings, and practical API integration.
                Focused on building real-world features like AI-powered analysis,
                assistants, and automation tools.
              </motion.p>
            </TimelineItem>

            {/* ITEM 4 */}
            <TimelineItem side="right">
              <motion.h3 variants={textVariant} className="font-semibold text-lg">
                Problem Solving & System Thinking{" "}
                
              </motion.h3>
              <motion.p variants={textVariant} className="text-indigo-600 text-sm mb-2">
                Thinking in Constraints
              </motion.p>
              <motion.p variants={textVariant} className="text-gray-600">
                Solving critical problems on LeetCode while developing
                a strong system-level mindset.
              </motion.p>
            </TimelineItem>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowIThink;