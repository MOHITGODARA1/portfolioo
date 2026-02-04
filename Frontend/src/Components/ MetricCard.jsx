import { motion } from "framer-motion";

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const MetricCard = ({ icon: Icon, title, value, subtitle, progress }) => {
  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition"
    >
      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-50 mb-6">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>

      {/* Content */}
      <p className="text-sm text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900 mb-4">{value}</h3>

      {/* Progress */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="h-full bg-indigo-600 rounded-full"
        />
      </div>

      <p className="text-sm text-slate-500">{subtitle}</p>
    </motion.div>
  );
};

export default MetricCard;