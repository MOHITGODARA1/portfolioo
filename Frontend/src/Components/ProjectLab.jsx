import React from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, hoverLift } from "./animations";
import { Github, ExternalLink } from "lucide-react";

const ProjectCard = ({
  experiment,
  title,
  hypothesis,
  outcome,
  stack,
  improve,
  github,
  live,
}) => {
  return (
    <motion.div
      variants={fadeUp}
      whileHover="hover"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="
        bg-white border border-gray-200 rounded-2xl
        p-8 shadow-sm
        transition-all
        hover:shadow-xl
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs tracking-widest text-indigo-600 mb-1">
            {experiment}
          </p>
          <h3 className="text-2xl font-semibold text-gray-900">
            {title}
          </h3>
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <Github size={18} />
            </a>
          )}
          {live && (
            <a
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">
            Hypothesis
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {hypothesis}
          </p>

          <h4 className="font-medium text-gray-900 mt-6 mb-2">
            Outcome
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {outcome}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">
            Tech Stack
          </h4>
          <div className="flex flex-wrap gap-2 mb-6">
            {stack.map((tech) => (
              <span
                key={tech}
                className="
                  px-3 py-1 text-xs rounded-full
                  bg-indigo-50 text-indigo-700
                  border border-indigo-100
                "
              >
                {tech}
              </span>
            ))}
          </div>

          <h4 className="font-medium text-gray-900 mb-2">
            What I’d Improve
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {improve}
          </p>
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
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <p className="text-sm tracking-widest text-indigo-600 mb-2">
            PROJECTS LAB
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Experiments & Builds
          </h2>
          <p className="max-w-xl mx-auto mt-4 text-gray-600">
            A collection of hands-on experiments where I test ideas,
            learn through failure, and refine my engineering thinking.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-16"
        >
          <ProjectCard
            experiment="Experiment #001"
            title="Apni Dukan"
            hypothesis="Small shopkeepers need a simple and reliable platform to order products in bulk without dealing with complex supply chains."
            outcome="Built a B2B e-commerce platform that allows shopkeepers to browse products, place bulk orders, and manage purchasing efficiently. Focused on scalable product data, cart logic for bulk quantities, and real-world order workflows."
            stack={["React", "Node.js","Express","MongoDB", "Tailwind CSS", "Twilio"]}
            improve="Plan to add supplier dashboards, order analytics, credit-based purchasing, and AI-assisted product recommendations for shopkeepers."
            github="https://github.com/MOHITGODARA1/ApniDukan"
            live="#"
          />

          <ProjectCard
            experiment="Community Platform"
            title="Unilink"
            hypothesis="Students benefit from a dedicated platform to connect, collaborate, and share opportunities within the same university ecosystem."
            outcome="Built a university-focused networking platform where students can connect with peers from the same institution, share posts, discover opportunities, and build academic or project-based connections. Focused on user experience, structured profiles, and secure data flow."
            stack={["React","Node.js", "REST APIs", "MongoDB", "TailwindCSS"]}
            improve="Plan to add university verification, real-time chat, group communities, event announcements, and AI-powered profile or opportunity recommendations."
            github="https://github.com/MOHITGODARA1/UniLink"
            live="https://unilink-1.onrender.com"
          />

          <ProjectCard
            experiment="AI Platform"
            title="DocGen AI"
            hypothesis="Students and developers need a faster way to understand unfamiliar GitHub repositories without manually exploring the entire codebase."
            outcome="Built an AI-powered platform where users paste a GitHub repository link and receive a structured analysis of the project, including repository structure, key folders, technologies used, and overall project overview. Focused on making complex codebases easier to understand for learning and collaboration."
            stack={[
              "React",
              "Node.js",
              "Express",
              "GitHub API",
              "OpenAI API",
              "Tailwind CSS",
            ]}
            improve="Plan to add deeper code-level analysis, auto-generated documentation, architecture diagrams, and comparison between multiple repositories."
            github="https://github.com/MOHITGODARA1/DocGen-AI"
            live="#"
          />

          <ProjectCard
            experiment="AI for Sustainability"
            title="AgroTech AI"
            hypothesis="Farmers can make better crop decisions when soil conditions and environmental data are analyzed intelligently instead of relying only on traditional methods."
            outcome="Built an AI-driven platform where farmers input soil parameters such as nutrient levels, moisture, and location details to receive data-informed recommendations on the most suitable crops to grow. Focused on usability, practical insights, and real-world agricultural constraints."
            stack={[
              "React",
              "Node.js",
              "Express",
              "Python",
              "Machine Learning",
              "OpenAI API",
              "Tailwind CSS",
            ]}
            improve="Plan to integrate weather APIs, regional crop databases, yield prediction models, and multilingual support to better serve farmers across different regions."
            github="https://github.com/MOHITGODARA1/agri-tech"
            live="#"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsLab;