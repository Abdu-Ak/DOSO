import React from "react";
import {
  GraduationCap,
  Globe,
  Sparkles,
  BookMarked,
  Heart,
  Shield,
} from "lucide-react";

const VALUES_DATA = [
  {
    icon: BookMarked,
    title: "Authentic Knowledge",
    description:
      "Preserving classical Islamic scholarship through qualified scholars and traditional methodologies.",
    gradient: "from-blue-500 to-indigo-600",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Sparkles,
    title: "Spiritual Excellence",
    description:
      "Nurturing the soul through worship, remembrance, and deep connection with Allah.",
    gradient: "from-emerald-500 to-teal-600",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: GraduationCap,
    title: "Academic Rigor",
    description:
      "Maintaining high standards while integrating contemporary educational approaches.",
    gradient: "from-purple-500 to-pink-600",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: Heart,
    title: "Compassion",
    description:
      "Fostering empathy, kindness, and care for all of Allah's creation.",
    gradient: "from-rose-500 to-red-600",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description:
      "Preparing students to contribute positively to society worldwide.",
    gradient: "from-cyan-500 to-blue-600",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    icon: Shield,
    title: "Integrity",
    description:
      "Upholding honesty, trustworthiness, and ethical conduct in all endeavors.",
    gradient: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
];

export default function CoreValues() {
  return (
    <section className="relative py-32 overflow-hidden bg-slate-900 dark:bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent-green/20"></div>
        <div className="absolute inset-0 bg-islamic-pattern opacity-5"></div>
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4">
            <span className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
              What We Stand For
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
            Our Core Values
          </h2>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-1 bg-gradient-to-r from-transparent to-emerald-400"></div>
            <div className="w-8 h-1 bg-emerald-400"></div>
            <div className="w-12 h-1 bg-gradient-to-l from-transparent to-emerald-400"></div>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            The principles that guide our educational philosophy and shape our
            community.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {VALUES_DATA.map((value, index) => {
            const Icon = value.icon;

            return (
              <div key={index} className="group relative">
                {/* Gradient Border Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${value.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500`}
                ></div>

                {/* Card */}
                <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 h-full">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 ${value.iconBg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                  >
                    <Icon className={value.iconColor} size={32} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {value.description}
                  </p>

                  {/* Decorative Corner */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inspirational Quote */}
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent-green/20 to-primary/20 rounded-3xl blur-2xl"></div>
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-12 md:p-16 text-center">
            {/* Quote Marks */}
            <div className="text-8xl text-emerald-400/20 font-serif leading-none mb-4">
              "
            </div>

            <p className="text-3xl md:text-4xl font-serif italic text-white leading-relaxed mb-8">
              The best of you are those who learn the Quran and teach it.
            </p>

            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-emerald-400"></div>
              <p className="text-emerald-300 font-semibold tracking-wider">
                Prophet Muhammad ﷺ
              </p>
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-emerald-400"></div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-8 left-8 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-8 right-8 w-3 h-3 bg-primary rounded-full animate-ping delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
