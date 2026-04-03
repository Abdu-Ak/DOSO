import React from "react";
import { getSettings } from "@/lib/settings";

export default async function Leadership() {
  const settings = await getSettings();
  const { leadership } = settings;

  const leaders = [
    {
      role: "President",
      data: leadership?.president,
      desc: "A renowned scholar dedicated to the revival of traditional learning methods",
      color: "bg-primary/10",
      textColor: "text-primary",
    },
    {
      role: "Secretary",
      data: leadership?.secretary,
      desc: "Managing the daily affairs of the institute with a focus on student welfare and administrative",
      color: "bg-accent/10",
      textColor: "text-accent",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-surface-dark" id="leadership">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-bold uppercase tracking-widest text-sm font-body mb-2 block">
            Our Guidance
          </span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Leadership & Faculty
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-body">
            Guided by scholars with profound wisdom and vision.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {leaders.map((leader, index) => (
            <div
              key={index}
              className="group bg-background-light dark:bg-background-dark rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row h-full">
                <div className="sm:w-2/5 h-64 sm:h-auto overflow-hidden">
                  <img
                    alt={`Portrait of ${leader.data?.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={
                      leader.data?.image ||
                      "https://images.unsplash.com/photo-1544161515-4af6b1d8c114?q=80&w=2670&auto=format&fit=crop"
                    }
                  />
                </div>
                <div className="sm:w-3/5 p-6 flex flex-col justify-center">
                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 ${leader.color} ${leader.textColor} text-xs font-bold rounded-full mb-2`}
                    >
                      {leader.role}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                      {leader.data?.name}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-body italic">
                      {leader.data?.title}
                    </p>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm font-body mb-4 line-clamp-3">
                    {leader.desc}
                  </p>
                  <div className="flex gap-3 mt-auto">
                    {leader.data?.email && (
                      <a
                        className="text-slate-400 hover:text-primary transition-colors"
                        href={`mailto:${leader.data?.email}`}
                      >
                        <span className="material-symbols-outlined text-xl">
                          mail
                        </span>
                      </a>
                    )}
                    {leader.data?.phone && (
                      <a
                        className="text-slate-400 hover:text-primary transition-colors"
                        href={`tel:${leader.data?.phone}`}
                      >
                        <span className="material-symbols-outlined text-xl">
                          call
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
