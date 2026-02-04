import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-semibold">
            &gt;_
          </div>
          <span className="text-lg font-semibold text-gray-900">
            Mohit Godara
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-700">
          <a href="#journey" className="hover:text-indigo-600 transition">
            Journey
          </a>
          <a href="#lab" className="hover:text-indigo-600 transition">
            Lab
          </a>
          <a href="#achievements" className="hover:text-indigo-600 transition">
            Achievements
          </a>
          <a href="#notes" className="hover:text-indigo-600 transition">
            Notes
          </a>
        </div>

        {/* CTA */}
        <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
          Contact
        </button>
      </div>
    </nav>
  );
};

export default Navbar;