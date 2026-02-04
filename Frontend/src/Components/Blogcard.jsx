import { motion } from "framer-motion";
import { card } from "./blogAnimations";
import { ArrowUpRight } from "lucide-react";

const BlogCard = ({ title, desc, date, time, level, levelColor }) => {
  return (
    <motion.article
      variants={card}
      whileHover={{ y: -4 }}
      className="
        group relative bg-white border border-gray-200 
        rounded-2xl p-6 shadow-sm 
        transition-all duration-300
        hover:shadow-md hover:border-gray-300
      "
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
            {desc}
          </p>
        </div>

        <ArrowUpRight
          className="
            w-5 h-5 text-gray-400 
            transform transition-all duration-300
            group-hover:translate-x-1 group-hover:-translate-y-1
            group-hover:text-gray-700
          "
        />
      </div>

      <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
        <span>{date}</span>
        <span>•</span>
        <span>{time}</span>
        <span
          className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${levelColor}`}
        >
          {level}
        </span>
      </div>
    </motion.article>
  );
};

export default BlogCard;