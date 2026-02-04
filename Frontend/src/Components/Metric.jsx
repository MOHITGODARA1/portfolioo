import React from "react";
import { motion } from "framer-motion";

const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const MetricCard = ({ icon: Icon, title, value, subtitle, progress }) => {
  return (
    <motion.div
      variants={cardVariant}
      whileHover={{
        y: -8,
        boxShadow: "0 25px 45px rgba(0,0,0,0.08)",
      }}
      transition={{ duration: 0.25 }}
      className="
        bg-white rounded-2xl border border-slate-200
        p-6 relative overflow-hidden
      "
    >
      {/* subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />

      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-6">
        <Icon className="text-indigo-600" size={22} />
      </div>

      {/* Content */}
      <h3 className="text-sm font-medium text-slate-500 mb-1">
        {title}
      </h3>

      <p className="text-3xl font-bold text-slate-900 mb-2">
        {value}
      </p>

      <p className="text-sm text-slate-600 mb-6">
        {subtitle}
      </p>

      {/* Progress */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="h-full bg-indigo-500 rounded-full"
        />
      </div>
    </motion.div>
  );
};

export default MetricCard;