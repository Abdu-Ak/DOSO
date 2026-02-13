import React from "react";

export default function HistoryMission() {
  return (
    <section className="py-16 md:py-24 bg-islamic-pattern" id="history">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-tl-3xl rounded-br-3xl -z-10"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/10 rounded-tl-3xl rounded-br-3xl -z-10"></div>
            <img
              alt="Students reading Quran in a traditionally designed library with wooden shelves"
              className="rounded-2xl shadow-2xl w-full h-auto object-cover aspect-4/3"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkDkLVSNBKU1y_S4kw5sDYcRuqVi92vJ-K4oA3WxhHqgXmKhoqUw5vlsGbON5eekzQNJUPh5L8EikWJ-05yGwW2MwPhqlJvzHgS0cUugmlpWgjdJOPColtsgjp-mEMQWrin3kmrZF--C0jjGTNmqvZsHR6uhpZZ8U8-hdqb1iRI97cC3PFAUJ_sj4zCYFkHpK4GMs0gTBhwZsjOiZcwPMBFTuec9AgY-jaRrk5Cno-BxvpjQSqyd955C7oq2FPsgFz5W4AoQidpg"
            />
            <div className="absolute bottom-6 left-6 bg-white dark:bg-surface-dark p-4 rounded-lg shadow-lg max-w-[200px]">
              <p className="text-4xl font-bold text-primary dark:text-white font-display">
                25+
              </p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 font-body">
                Years of Educational Excellence
              </p>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-accent"></span>
              <span className="text-accent font-bold uppercase tracking-widest text-sm font-body">
                Our Story
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Rooted in Tradition, <br />
              Reaching for Excellence
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 font-body leading-relaxed">
              Founded on the noble principles of knowledge and piety, Darul
              Hidaya Dars has been a beacon of light for decades. We are
              dedicated to nurturing the next generation of scholars and leaders
              who are not only well-versed in Islamic sciences but also aware of
              their contemporary responsibilities.
            </p>
            <p className="text-base text-slate-500 dark:text-slate-400 mb-8 font-body leading-relaxed">
              Our mission extends beyond the classroom. We aim to cultivate a
              community where spiritual values are lived daily, and where
              service to humanity becomes a natural expression of faith.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <span className="material-symbols-outlined text-primary text-3xl mb-2">
                  history_edu
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Classical Curriculum
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-body">
                  Dars-e-Nizami based syllabus.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="material-symbols-outlined text-primary text-3xl mb-2">
                  volunteer_activism
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Ethical Training
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-body">
                  Focus on Adab and Akhlaq.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
