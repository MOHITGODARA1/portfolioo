import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { fadeUp } from "./contactAnimations";
import InputField from "./InputField";

// ✅ INITIALIZE ONCE
emailjs.init("jSxFrOlhAOiiDJbCA");

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");

    emailjs
      .send(
        "service_eo6kkri",
        "template_y1amy1i",
        {
          name: form.name,
          email: form.email,
          number: form.number,
          message: form.message,
          time: new Date().toLocaleString(),
        }
      )
      .then(() => {
        setStatus("success");
        setForm({
          name: "",
          email: "",
          number: "",
          message: "",
        });
      })
      .catch((err) => {
        console.error("EMAILJS ERROR:", err);
        setStatus("error");
      });
  };

  return (
    <section className="w-full bg-white py-32">
      <div className="max-w-xl mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-widest text-indigo-600 mb-2">
            CONTACT
          </p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Let’s Talk
          </h1>
          <p className="text-gray-600">
            Have a project, opportunity, or question?  
            Send a message and I’ll get back to you.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <InputField label="Full Name" name="name" value={form.name} onChange={handleChange} />
          <InputField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} />
          <InputField label="Phone Number" name="number" type="tel" value={form.number} onChange={handleChange} />
          <InputField label="Message" name="message" textarea value={form.message} onChange={handleChange} />

          <motion.button
            type="submit"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-4 rounded-lg bg-indigo-600 text-white py-3"
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </motion.button>

          {status === "success" && <p className="text-green-600 text-center">Message sent successfully ✅</p>}
          {status === "error" && <p className="text-red-600 text-center">Failed to send message.</p>}
        </motion.form>
      </div>
    </section>
  );
};

export default ContactUs;