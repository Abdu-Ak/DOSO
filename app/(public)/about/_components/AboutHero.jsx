import React from "react";
import { BookOpen, Users, Award, Sparkles } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-slate-900">
        <div className="absolute inset-0 bg-islamic-pattern opacity-20"></div>
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent-green/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center text-white">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in">
          <Sparkles size={16} className="text-emerald-300" />
          <span className="text-sm font-semibold text-emerald-200 uppercase tracking-wider">
            Established 1994
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-extrabold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
            Darul Hidaya Dars
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed mb-12 font-light">
          Where{" "}
          <span className="text-emerald-300 font-semibold">
            authentic Islamic scholarship
          </span>{" "}
          meets
          <span className="text-emerald-300 font-semibold">
            {" "}
            modern excellence
          </span>
          , nurturing the next generation of faithful leaders and scholars.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-emerald-400/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-emerald-300" size={24} />
            </div>
            <div className="text-4xl font-bold mb-2">25+</div>
            <div className="text-sm text-slate-300 uppercase tracking-wider">
              Years
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-emerald-400/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="text-emerald-300" size={24} />
            </div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-sm text-slate-300 uppercase tracking-wider">
              Alumni
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-emerald-400/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="text-emerald-300" size={24} />
            </div>
            <div className="text-4xl font-bold mb-2">100%</div>
            <div className="text-sm text-slate-300 uppercase tracking-wider">
              Dedicated
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-emerald-400/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-emerald-300" size={24} />
            </div>
            <div className="text-4xl font-bold mb-2">∞</div>
            <div className="text-sm text-slate-300 uppercase tracking-wider">
              Impact
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
