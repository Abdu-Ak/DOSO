import React from "react";

export default function Events() {
  return (
    <section
      className="py-20 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800"
      id="events"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-accent font-bold uppercase tracking-widest text-sm font-body mb-2 block">
              Updates
            </span>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
              Recent Happenings
            </h2>
          </div>
          <a
            className="hidden md:flex items-center gap-1 text-primary hover:text-primary-dark font-bold text-sm transition-colors"
            href="#"
          >
            View All Events{" "}
            <span className="material-symbols-outlined text-lg">
              arrow_right_alt
            </span>
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Event 1 */}
          <article className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group">
            <div className="relative h-56 overflow-hidden">
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg z-10 text-center min-w-[60px] shadow-sm">
                <span className="block text-xs font-bold text-slate-500 uppercase">
                  Oct
                </span>
                <span className="block text-2xl font-bold text-primary leading-none">
                  14
                </span>
              </div>
              <img
                alt="Weekly Jumma Khutbah"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMS074KV8r8kbdpKGA2wWgvgmhWWHS_hnGHbKa_ys7rRBO_0cZq2_ywgDXwVWjZ5klMchA0a5rRLRV_OWznrpPmARB_3exYrocaROrTEzobjreTsJeuFi8_NcHCaeJiK8r0gPlIXS7qQla7K9rZusYjdaWqD6JcPmSBWXIj5fdoPytWxamxkn-QBMomyR3FgOc_4je8TOGJnmnKhEDa0_KQ7vTjgj2PyvuJlQ6qh0pEcWNmrovwuUP3ua9sDPx7guvvsoLSZDkFw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-accent font-bold mb-3">
                <span className="material-symbols-outlined text-sm">event</span>
                <span>COMMUNITY</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                Weekly Jumma Khutbah
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 font-body">
                Join us every Friday for an enlightening sermon followed by
                congregational prayers.
              </p>
              <a
                className="inline-flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
                href="#"
              >
                Read More{" "}
                <span className="material-symbols-outlined text-sm ml-1">
                  chevron_right
                </span>
              </a>
            </div>
          </article>
          {/* Event 2 */}
          <article className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group">
            <div className="relative h-56 overflow-hidden">
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg z-10 text-center min-w-[60px] shadow-sm">
                <span className="block text-xs font-bold text-slate-500 uppercase">
                  Nov
                </span>
                <span className="block text-2xl font-bold text-primary leading-none">
                  05
                </span>
              </div>
              <img
                alt="Annual Islamic Conference"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAef_ncSpW4p0fyBfVIyozbQJqhOT4hQErSoZZ-ztq3SM_IH1OIP14oCDfsB42QADdEb_PbeXRJUQV4YDeV0bnXrEvQ-PUp8tFdPFpIXFttnOTQVtNIW2ojgA0o5p-z2JzAt8P5twYYs4VWGGU99RTPokUEcXyDTTYLjH76SvQfmgHQaaS9MYqii6Wqd7a5-_W0jHhc-Rt9XiJEeP-vv3-KPmpyiAR-k8QGRPUE-KiYxebzwLu_hqcN9mOKZBKt3Z24U0fk4bm3BQ"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-accent font-bold mb-3">
                <span className="material-symbols-outlined text-sm">
                  school
                </span>
                <span>EDUCATION</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                Annual Islamic Conference
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 font-body">
                A day of learning with guest scholars from around the world
                discussing contemporary issues.
              </p>
              <a
                className="inline-flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
                href="#"
              >
                Read More{" "}
                <span className="material-symbols-outlined text-sm ml-1">
                  chevron_right
                </span>
              </a>
            </div>
          </article>
          {/* Event 3 */}
          <article className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group">
            <div className="relative h-56 overflow-hidden">
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg z-10 text-center min-w-[60px] shadow-sm">
                <span className="block text-xs font-bold text-slate-500 uppercase">
                  Dec
                </span>
                <span className="block text-2xl font-bold text-primary leading-none">
                  20
                </span>
              </div>
              <img
                alt="Student Graduation Ceremony"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCVZpC0xUUq6cbXclP_5vVWKtA0J3T07A3Vd8ZVUm4pQ2JyRl9Hll1tsXdcf1yPCDQ7Ztb1E5G4sF4lpiR0V7SzxILA6acyaMNOKELVzKzTOnCq7AeAGf3hJLmBDeIKrCQTugP53lp-223sv72fqOZK_9jwhBt39upiSNcKdCpZvKono4xX1BrG4WW4C87UGXK6pUYRLhIDBIKhkz8maDoEdd-Vv6hGs9bUEtFe7k8cdbuiIcqahj3v6ydaCU4zC6R7pTXcI1wBg"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-accent font-bold mb-3">
                <span className="material-symbols-outlined text-sm">
                  celebration
                </span>
                <span>CEREMONY</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                Student Graduation Ceremony
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 font-body">
                Celebrating the achievements of our Dars students as they
                complete their studies.
              </p>
              <a
                className="inline-flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
                href="#"
              >
                Read More{" "}
                <span className="material-symbols-outlined text-sm ml-1">
                  chevron_right
                </span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
