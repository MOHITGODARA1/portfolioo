import { motion } from "framer-motion";
import { fadeUp } from "./contactAnimations";
import InputField from "./InputField";

const ContactSection = () => {
  return (
    <section className="w-full bg-white py-32">
      <div className="max-w-xl mx-auto px-6">
        
        {/* Heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          className="text-center mb-16"
        >
          <p className="text-sm tracking-widest text-indigo-600 mb-2">
            GET IN TOUCH
          </p>
          <h2 className="text-4xl font-bold text-gray-900">
            Let’s Connect
          </h2>
        </motion.div>

        {/* Form */}
        <motion.form
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          className="space-y-6"
        >
          <InputField
            label="Name"
            placeholder="Your name"
          />

          <InputField
            label="Email"
            type="email"
            placeholder="your@email.com"
          />

          <InputField
            label="Message"
            placeholder="What would you like to discuss?"
            textarea
          />

          {/* Button */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="
              w-full mt-4 rounded-lg
              bg-indigo-600 text-white
              py-3 text-sm font-medium
              transition-colors duration-200
              hover:bg-indigo-700
              focus:outline-none focus:ring-2 focus:ring-indigo-500/40
            "
          >
            Send Message
          </motion.button>
        </motion.form>

        {/* Footer */}
        <div className="mt-20 border-t pt-6 flex items-center justify-between text-sm text-gray-500">
          <p>© 2026 Mohit Godara. Built with intention.</p>
          <div className="flex gap-4">
            <span className="hover:text-gray-700 cursor-pointer">GitHub</span>
            <span className="hover:text-gray-700 cursor-pointer">LinkedIn</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;