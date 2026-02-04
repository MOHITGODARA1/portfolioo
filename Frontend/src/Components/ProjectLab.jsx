import React from "react";
import { motion } from "framer-motion";
import { fadeUp } from "./animations";

const ProjectCard = ({ experiment, title, hypothesis, outcome, stack, improve }) => {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm"
    >
      <p className="text-xs text-gray-500 mb-1">{experiment}</p>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Hypothesis</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{hypothesis}</p>

          <h4 className="font-medium text-gray-900 mt-6 mb-2">Outcome</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{outcome}</p>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Tech Stack</h4>
          <div className="flex flex-wrap gap-2 mb-6">
            {stack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs bg-indigo-50 text-indigo-700 rounded"
              >
                {tech}
              </span>
            ))}
          </div>

          <h4 className="font-medium text-gray-900 mb-2">What I’d Improve</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{improve}</p>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsLab = () => {
  return (
    <section className="w-full bg-gray-50 py-32">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-sm tracking-widest text-indigo-600 mb-2">
            PROJECTS LAB
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Experiments & Builds
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="space-y-16">
          <ProjectCard
            experiment="Experiment #001"
            title="Task Flow"
            hypothesis="A well-designed task manager can improve daily productivity by reducing cognitive load through smart categorization."
            outcome="Successfully built a functional task manager with drag-and-drop, categories, and priority levels. Learned state management patterns."
            stack={["React", "TypeScript", "Tailwind CSS", "LocalStorage"]}
            improve="Would add cloud sync and collaborative features. Improve keyboard navigation for accessibility."
          />

          <ProjectCard
            experiment="Experiment #002"
            title="Weather Dashboard"
            hypothesis="Presenting weather data with clear visual hierarchy makes information consumption faster and more intuitive."
            outcome="Created an interactive dashboard with 7-day forecasts, hourly breakdowns, and location search. Practiced API integration."
            stack={["React", "REST APIs", "Chart.js", "CSS Modules"]}
            improve="Would implement caching strategy and offline support. Add weather alerts feature."
          />
          <ProjectCard
            experiment="Experiment #003"
            title="Smart Expense Tracker"
            hypothesis="Tracking expenses with visual feedback and categorization helps users make better financial decisions."
            outcome="Built an expense tracker with category-wise breakdown, monthly summaries, and charts. Improved understanding of data normalization and derived state."
            stack={["React", "JavaScript", "Tailwind CSS", "Recharts"]}
            improve="Would add budget limits with alerts, export to CSV, and authentication for multi-device usage."
          />

          <ProjectCard
            experiment="Experiment #004"
            title="AI Resume Analyzer"
            hypothesis="Providing structured feedback on resumes can significantly improve job application quality."
            outcome="Created a resume analyzer that evaluates structure, keyword relevance, and formatting. Strengthened skills in conditional rendering and UX feedback."
            stack={["React", "Node.js", "Express", "OpenAI API"]}
            improve="Would improve accuracy with better prompt engineering, add ATS scoring, and support multiple resume templates."
          />
        </div>
      </div>
    </section>
  );
};

export default ProjectsLab;