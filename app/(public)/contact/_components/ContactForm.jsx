"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Admissions Inquiry",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <div className="bg-white dark:bg-slate-900/80 p-10 mosque-arch-card shadow-2xl shadow-primary/5 border border-primary/10">
      <h1 className="text-4xl font-serif font-bold mb-4 text-primary dark:text-white">
        Get in Touch
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
        Have a question about our curriculum or admissions? Send us a message
        and our administrative team will respond within 24 hours.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Full Name
            </label>
            <input
              className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Enter your name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="your@email.com"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Subject</label>
          <select
            className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
          >
            <option>Admissions Inquiry</option>
            <option>General Information</option>
            <option>Support Our Institute</option>
            <option>Technical Issue</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Message</label>
          <textarea
            className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="How can we help you?"
            rows="5"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Send size={16} />
          Send Message
        </button>
      </form>
    </div>
  );
}
