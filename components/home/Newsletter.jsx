import React from "react";

export default function Newsletter() {
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full border-8 border-white/5 opacity-50"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full border-8 border-white/5 opacity-50"></div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Stay Connected With Us
        </h2>
        <p className="text-blue-100 max-w-2xl mx-auto mb-8 font-body">
          Subscribe to our newsletter to receive updates on prayer times,
          upcoming events, and community news.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            className="grow px-5 py-3 rounded-lg border-2 border-transparent focus:border-white/50 focus:outline-none bg-white/10 text-white placeholder-blue-200 font-body"
            placeholder="Enter your email address"
            type="email"
          />
          <button
            className="bg-white text-primary hover:bg-slate-100 transition-colors font-bold px-8 py-3 rounded-lg shadow-lg"
            type="button"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
