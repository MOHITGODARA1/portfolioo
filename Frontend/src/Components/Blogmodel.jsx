import { motion } from "framer-motion";
import { modalVariant } from "./blogAnimations";
import { X } from "lucide-react";

const BlogModal = ({ blog, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        variants={modalVariant}
        initial="hidden"
        animate="visible"
        className="
          relative bg-white max-w-3xl w-full
          rounded-2xl p-8 max-h-[85vh]
          overflow-y-auto
        "
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-xs px-3 py-1 rounded-full ${blog.levelColor}`}>
            {blog.level}
          </span>
          <span className="text-xs text-gray-500">
            {blog.date} · {blog.time}
          </span>
        </div>

        {/* Content */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {blog.title}
        </h2>

        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {blog.content}
        </p>
      </motion.div>
    </div>
  );
};

export default BlogModal;