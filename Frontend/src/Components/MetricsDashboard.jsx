import React from "react";
import { motion } from "framer-motion";
import {
  Target,
  Trophy,
  BadgeCheck,
  FolderKanban,
} from "lucide-react";
import MetricCard from "./Metric";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const MetricsDashboard = () => {
  return (
    <section className="w-full bg-slate-50 py-28">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <p className="text-sm tracking-widest text-indigo-600 uppercase mb-3">
            Validated Progress
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Metrics Dashboard
          </h2>

          <p className="max-w-xl mx-auto text-slate-600">
            A measurable snapshot of my learning consistency, competitive
            progress, and real-world project execution.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="
            grid grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-8
          "
        >
          <MetricCard
            icon={Target}
            title="LeetCode Problems"
            value="250+"
            subtitle="Solved across Easy, Medium, Hard"
            progress={78}
          />

          <MetricCard
            icon={Trophy}
            title="Contest Rating"
            value="1,650"
            subtitle="Top 15% globally"
            progress={65}
          />

          <MetricCard
            icon={BadgeCheck}
            title="Certifications"
            value="4"
            subtitle="Meta, freeCodeCamp, Coursera"
            progress={80}
          />

          <MetricCard
            icon={FolderKanban}
            title="Projects Built"
            value="12"
            subtitle="Personal & collaborative"
            progress={70}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default MetricsDashboard;