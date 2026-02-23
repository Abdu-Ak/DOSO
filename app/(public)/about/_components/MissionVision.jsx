import React from "react";
import { Target, Lightbulb } from "lucide-react";

export default function MissionVision() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white dark:from-background-dark dark:via-slate-900 dark:to-background-dark">
        <div className="absolute inset-0 islamic-pattern opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent-green/10 border border-primary/20 mb-4">
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              Our Purpose
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white mb-6">
            Mission & Vision
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-1 bg-gradient-to-r from-transparent to-primary"></div>
            <div className="w-8 h-1 bg-primary"></div>
            <div className="w-12 h-1 bg-gradient-to-l from-transparent to-primary"></div>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Mission Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark rounded-3xl transform group-hover:scale-105 transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-islamic-pattern opacity-10 rounded-3xl"></div>

            <div className="relative p-12 text-white">
              {/* Icon */}
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform duration-500">
                <Target size={40} className="text-white" />
              </div>

              {/* Content */}
              <h3 className="text-3xl font-serif font-bold mb-6">
                Our Mission
              </h3>
              <p className="text-lg text-white/90 leading-relaxed mb-8">
                To provide comprehensive Islamic education that combines
                traditional scholarship with modern pedagogy, nurturing students
                who are grounded in faith, equipped with knowledge, and
                committed to serving humanity.
              </p>

              {/* Features */}
              <div className="space-y-4">
                {[
                  "Authentic Islamic knowledge transmission",
                  "Character development and moral excellence",
                  "Community engagement and service",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 group/item"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center mt-0.5 group-hover/item:scale-110 transition-transform">
                      <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
                    </div>
                    <span className="text-white/90 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* Decorative Element */}
              <div className="absolute top-8 right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            </div>
          </div>

          {/* Vision Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-green to-emerald-700 rounded-3xl transform group-hover:scale-105 transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-islamic-pattern opacity-10 rounded-3xl"></div>

            <div className="relative p-12 text-white">
              {/* Icon */}
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform duration-500">
                <Lightbulb size={40} className="text-white" />
              </div>

              {/* Content */}
              <h3 className="text-3xl font-serif font-bold mb-6">Our Vision</h3>
              <p className="text-lg text-white/90 leading-relaxed mb-8">
                To be a leading center of Islamic learning that produces
                scholars, leaders, and professionals who embody the values of
                Islam and contribute positively to society while maintaining
                spiritual excellence.
              </p>

              {/* Features */}
              <div className="space-y-4">
                {[
                  "Excellence in Islamic scholarship",
                  "Global impact through education",
                  "Spiritual and intellectual growth",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 group/item"
                  >
                    <div className="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center mt-0.5 group-hover/item:scale-110 transition-transform">
                      <div className="w-2 h-2 rounded-full bg-yellow-300"></div>
                    </div>
                    <span className="text-white/90 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* Decorative Element */}
              <div className="absolute top-8 right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
