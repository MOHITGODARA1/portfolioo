import { motion } from "framer-motion";

const InputField = ({ label, type = "text", placeholder, textarea }) => {
  const Component = textarea ? "textarea" : "input";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-1"
    >
      <label className="text-sm font-medium text-gray-900">
        {label}
      </label>

      <Component
        type={type}
        placeholder={placeholder}
        rows={textarea ? 4 : undefined}
        className="
          w-full rounded-lg border border-gray-200
          px-4 py-3 text-sm
          focus:outline-none focus:ring-2 focus:ring-indigo-500/30
          focus:border-indigo-500
          transition-all duration-200
        "
      />
    </motion.div>
  );
};

export default InputField;