import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-28 text-center">

        {/* Journey Card (Top → Down) */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-xl mx-auto mb-14 p-5 rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-semibold tracking-wide text-gray-700">
              JOURNEY MILESTONE
            </p>
            <p className="text-sm font-medium text-indigo-600">
              Phase 01: Core Mastery
            </p>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-indigo-600 w-[65%] rounded-full"></div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Currently exploring advanced Data Structure and Algorithm
            </span>
            <span className="font-medium">65%</span>
          </div>
        </motion.div>

        {/* Name Animation */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-5">
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Mohit
          </motion.span>

          <motion.span
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            
          >
            Godara
          </motion.span>

          {/* Role (Bottom → Up) */}
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="block text-indigo-600 text-lg md:text-2xl mt-1 font-medium"
          >
            Software Development Engineer (SDE)
          </motion.span>
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          className="max-w-xl mx-auto text-gray-600 text-base md:text-md leading-relaxed mb-10"
        >
          Solving critical Data Structures and Algorithms problems, scalable backend systems with clean architecture
            and maintainable code.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
            🚀 Start My Journey
          </button>

          <button className="flex items-center gap-2 border border-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
            🧪 Open Projects Lab
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;