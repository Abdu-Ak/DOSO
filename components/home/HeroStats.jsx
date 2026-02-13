import React from "react";

export default function HeroStats() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full min-h-[600px] flex items-center justify-center overflow-hidden bg-primary">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Interior of a beautiful mosque with intricate geometric patterns and warm lighting"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOMg7wC-8BKQ6LpucdPYpghvZMY1uELhBXKlO6mh-ZrZKaoryTF6WogXNOn8RPYj5Sdx1_ZN_Z_510tZvWFQ9bS7xLk04Xc-SYIQ3aZHqOBokkjmfVMgKUNtE9jOxePUj1BPho9tccOWHVHHoT7wP82NvuopcXof95DTLIOrY_k-Dqes4Z26iBEeTTkklkaanyTlaVt3ma6wFmBT_7wP9n9HvSPJcvse_1QbOCZ1bTX7iIfKHNMomsmeN0a-Ipdv_dy2r6hmE_AQ"
          />
          <div className="absolute inset-0 bg-linear-to-b from-primary/80 via-primary/60 to-background-light dark:to-background-dark"></div>
          {/* Geometric Pattern Overlay */}
          <div className="absolute inset-0 bg-islamic-pattern opacity-10"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl pt-10 pb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-6">
            <span className="material-symbols-outlined text-sm">
              auto_awesome
            </span>
            <span className="text-xs font-bold tracking-wider uppercase font-body">
              Preserving Heritage
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-shadow-lg">
            Enlightening Minds,
            <br />{" "}
            <span className="text-emerald-300 italic">Purifying Souls</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-100 mb-10 max-w-2xl mx-auto font-body leading-relaxed text-shadow-sm">
            Welcome to Darul Hidaya Dars, a center for Islamic excellence where
            traditional knowledge meets modern understanding in an environment
            of spiritual growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-white text-primary hover:bg-slate-100 transition-colors font-bold text-base py-3.5 px-8 rounded-lg shadow-lg flex items-center justify-center gap-2">
              <span>Begin Journey</span>
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </button>
            <button className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white hover:bg-white/10 transition-colors font-bold text-base py-3 px-8 rounded-lg flex items-center justify-center gap-2">
              <span>Admissions</span>
              <span className="material-symbols-outlined text-sm">school</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats / Quick Info Bar */}
      <section className="relative z-20 -mt-16 container mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-xl border-t-4 border-accent flex items-start gap-4">
            <div className="bg-accent/10 p-3 rounded-lg text-accent">
              <span className="material-symbols-outlined text-3xl">
                menu_book
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                Authentic Knowledge
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-body">
                Based on traditional Islamic sciences and methodology.
              </p>
            </div>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-xl border-t-4 border-primary flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg text-primary">
              <span className="material-symbols-outlined text-3xl">
                self_improvement
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                Spiritual Growth
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-body">
                Fostering Tazkiyah and inner purification for all students.
              </p>
            </div>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-xl border-t-4 border-accent flex items-start gap-4">
            <div className="bg-accent/10 p-3 rounded-lg text-accent">
              <span className="material-symbols-outlined text-3xl">groups</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                Community
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-body">
                Building a supportive brotherhood dedicated to service.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
