import { motion } from "framer-motion";
import { cardFadeUp } from "./blogAnimations";

const BlogCard = ({
  title,
  desc,
  date,
  time,
  level,
  levelColor,
  onClick,
}) => {
  return (
    <motion.div
      variants={cardFadeUp}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className="
        bg-white border border-gray-200 rounded-xl
        p-6 cursor-pointer
        hover:shadow-lg transition
      "
    >
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-xs px-3 py-1 rounded-full ${levelColor}`}>
          {level}
        </span>
        <span className="text-xs text-gray-500">
          {date} · {time}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      <p className="text-gray-600 text-sm">
        {desc}
      </p>
    </motion.div>
  );
};

export default BlogCard;