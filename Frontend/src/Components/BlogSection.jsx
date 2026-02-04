import { motion } from "framer-motion";
import { container } from "./blogAnimations";
import BlogCard from "./Blogcard";

const BlogSection = () => {
  return (
    <section className="w-full bg-gray-50 py-32">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-widest text-indigo-600 mb-2">
            ENGINEERING NOTES
          </p>
          <h2 className="text-4xl font-bold text-gray-900">
            What I’m Learning
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          className="space-y-6"
        >
          <BlogCard
            title="Understanding React’s Reconciliation Algorithm"
            desc="A deep dive into how React decides what to re-render and why keys matter more than you think."
            date="Jan 15, 2026"
            time="8 min"
            level="Intermediate"
            levelColor="bg-indigo-50 text-indigo-700"
          />

          <BlogCard
            title="My Approach to Solving LeetCode Problems"
            desc="The mental framework I use to break down algorithmic challenges and build intuition."
            date="Jan 8, 2026"
            time="6 min"
            level="Beginner"
            levelColor="bg-green-50 text-green-700"
          />

          <BlogCard
            title="TypeScript Generics: From Confusion to Clarity"
            desc="How I finally understood generics and started writing reusable, flexible code."
            date="Dec 28, 2025"
            time="10 min"
            level="Intermediate"
            levelColor="bg-indigo-50 text-indigo-700"
          />

          <BlogCard
            title="Building Accessible Components from Scratch"
            desc="Lessons learned while implementing ARIA patterns and keyboard navigation in React."
            date="Dec 20, 2025"
            time="12 min"
            level="Advanced"
            levelColor="bg-orange-50 text-orange-700"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;