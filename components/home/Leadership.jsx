import React from "react";

export default function Leadership() {
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
          <div className="group bg-background-light dark:bg-background-dark rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row h-full">
              <div className="sm:w-2/5 h-64 sm:h-auto overflow-hidden">
                <img
                  alt="Portrait of Sheikh Abdul Rahman"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi8J5tmulyHKlkcxkgxjSJ7t-IgEFACHK8wvRVyqDbz6vhdlQsvg3GfX1HjYvKEPzkcQT9cqq6WEZnFFIpQYHlijQXH0SJjRp-ma6UBZbVmZcuswSiY1Ut7DiMQm8yIAp1l3jwHD7gV_vqArDxUl_Ghdgr8SaiPB7IkPMv-yEb3BQb3J3kRUf24pzfZftjhRtET_k_jhQtHm_Cs6LeX0CmJp5-cWzhw8cRGABzV7IxEsQBvS3UWSUCJxsdcNM-0053JpPtYBlkPA"
                />
              </div>
              <div className="sm:w-3/5 p-6 flex flex-col justify-center">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-2">
                    President
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    Sheikh Abdul Rahman
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-body italic">
                    Leading with wisdom since 2010
                  </p>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm font-body mb-4 line-clamp-3">
                  A renowned scholar dedicated to the revival of traditional
                  learning methods and community welfare.
                </p>
                <div className="flex gap-3 mt-auto">
                  <a
                    className="text-slate-400 hover:text-primary transition-colors"
                    href="#"
                  >
                    <span className="material-symbols-outlined text-xl">
                      mail
                    </span>
                  </a>
                  <a
                    className="text-slate-400 hover:text-primary transition-colors"
                    href="#"
                  >
                    <span className="material-symbols-outlined text-xl">
                      call
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="group bg-background-light dark:bg-background-dark rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row h-full">
              <div className="sm:w-2/5 h-64 sm:h-auto overflow-hidden">
                <img
                  alt="Portrait of Ustadh Karim"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHvyXsK9n1h9yHJkm6hML0yUtgDNFGzfLIVPtGsSsf-HGyeo1e865ytmQNCgaOuVSsViUpSeXf_qTFl5lmZH9G9McLN1-LUA46TOPPQCwakeDY4ECrHPn818dFB4xm7xfKVy3x4haV_NMV8UEcKhKfs42Nibkh4cf4pzR9u3PRcQvpx3WWjMM0FkqBeyXT-o2gq7HWLneMxeMr8zuryCZDNjKk9SvO9w7lMW00XRAzQawQDJcwmEgPGB90lRTIrGvFIP25v9Kheg"
                />
              </div>
              <div className="sm:w-3/5 p-6 flex flex-col justify-center">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full mb-2">
                    Secretary
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    Ustadh Karim
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-body italic">
                    Commitment to excellence
                  </p>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm font-body mb-4 line-clamp-3">
                  Managing the daily affairs of the institute with a focus on
                  student welfare and administrative transparency.
                </p>
                <div className="flex gap-3 mt-auto">
                  <a
                    className="text-slate-400 hover:text-primary transition-colors"
                    href="#"
                  >
                    <span className="material-symbols-outlined text-xl">
                      mail
                    </span>
                  </a>
                  <a
                    className="text-slate-400 hover:text-primary transition-colors"
                    href="#"
                  >
                    <span className="material-symbols-outlined text-xl">
                      call
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
