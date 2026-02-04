import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { container } from "./blogAnimations";
import BlogCard from "./BlogCard";
import BlogModal from "./Blogmodel";
const blogs = [
  {
    title: "Understanding React’s Reconciliation Algorithm",
    desc: "A deep dive into how React decides what to re-render and why keys matter.",
    date: "Jan 15, 2026",
    time: "8 min",
    level: "Intermediate",
    levelColor: "bg-indigo-50 text-indigo-700",
    content: `
React’s reconciliation algorithm compares the previous virtual DOM
with the new one to determine the minimal set of changes required.

Keys play a critical role by helping React identify which elements
have changed, been added, or removed.

In this article, I break down the diffing process, common mistakes,
and performance implications with real examples.
`,
  },
  {
    title: "My Approach to Solving LeetCode Problems",
    desc: "The mental framework I use to break down algorithmic challenges.",
    date: "Jan 8, 2026",
    time: "6 min",
    level: "Beginner",
    levelColor: "bg-green-50 text-green-700",
    content: `
I focus on understanding constraints before touching code.

I classify problems into patterns (two pointers, sliding window, DP),
then build a brute-force solution before optimizing.

This method helps reduce panic and increases consistency.
`,
  },
];

const BlogSection = () => {
  const [activeBlog, setActiveBlog] = useState(null);

  useEffect(() => {
    document.body.style.overflow = activeBlog ? "hidden" : "auto";
  }, [activeBlog]);

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

        {/* Blog Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          className="space-y-6"
        >
          {blogs.map((blog, index) => (
            <BlogCard
              key={index}
              {...blog}
              onClick={() => setActiveBlog(blog)}
            />
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      {activeBlog && (
        <BlogModal
          blog={activeBlog}
          onClose={() => setActiveBlog(null)}
        />
      )}
    </section>
  );
};

export default BlogSection;