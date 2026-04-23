import React from "react";
import { AtSign, Mail, Phone, Smartphone } from "lucide-react";
import { getSettings } from "@/lib/settings";

export default async function LeadershipSection() {
  const settings = await getSettings();
  const { leadership } = settings;

  const LEADERSHIP_DATA = [
    {
      name: leadership?.president?.name || "Sheikh Abdullah Omar",
      title: leadership?.president?.title || "President",
      email: leadership?.president?.email || "president@darulhidaya.edu",
      phone: leadership?.president?.phone || "101",
      image:
        leadership?.president?.image ||
        "https://images.unsplash.com/photo-1544161515-4af6b1d8c114?q=80&w=2670&auto=format&fit=crop",
      headerColor: "bg-primary",
      titleColor: "text-primary",
      hoverColor: "hover:bg-primary/5",
    },
    {
      name: leadership?.secretary?.name || "Mr. Ahmed Al-Masri",
      title: leadership?.secretary?.title || "General Secretary",
      email: leadership?.secretary?.email || "secretary@darulhidaya.edu",
      phone: leadership?.secretary?.phone || "105",
      image:
        leadership?.secretary?.image ||
        "https://images.unsplash.com/photo-1544161515-4af6b1d8c114?q=80&w=2670&auto=format&fit=crop",
      headerColor: "bg-accent-green",
      titleColor: "text-accent-green",
      hoverColor: "hover:bg-accent-green/5",
    },
    // {
    //   name: leadership?.headmaster?.name || "Maulana Yusuf Hassan",
    //   title: leadership?.headmaster?.title || "Head Master",
    //   email: leadership?.headmaster?.email || "headmaster@darulhidaya.edu",
    //   phone: leadership?.headmaster?.phone || "110",
    //   image:
    //     leadership?.headmaster?.image ||
    //     "https://images.unsplash.com/photo-1544161515-4af6b1d8c114?q=80&w=2670&auto=format&fit=crop",
    //   headerColor: "bg-primary",
    //   titleColor: "text-primary",
    //   hoverColor: "hover:bg-primary/5",
    // },
  ].slice(0, 2);

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-accent-green font-bold uppercase tracking-widest text-sm mb-3">
            Governance
          </h2>
          <h2 className="text-4xl font-serif font-bold text-slate-900 dark:text-white">
            Department Leadership
          </h2>
          <div className="w-24 h-1 bg-primary/20 mx-auto mt-6"></div>
          <p className="text-slate-500 dark:text-slate-400 mt-6 max-w-2xl mx-auto">
            Direct access to our senior administrative staff for departmental
            matters.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {LEADERSHIP_DATA.map((leader, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 mosque-arch-card overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`h-28 ${leader.headerColor}`}></div>
              <div className="px-6 pb-10 -mt-14 text-center">
                <img
                  className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 mx-auto object-cover shadow-lg mb-4"
                  alt={`Portrait of ${leader.name}`}
                  src={leader.image}
                />
                <h3 className="text-xl font-serif font-bold">{leader.name}</h3>
                <p
                  className={`${leader.titleColor} font-bold text-xs mb-8 uppercase tracking-widest`}
                >
                  {leader.title}
                </p>
                <div className="space-y-3 text-sm">
                  <a
                    className={`flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg ${leader.hoverColor} transition-colors group`}
                    href={`mailto:${leader.email}`}
                  >
                    <Mail size={18} className={leader.titleColor} />
                    <span className="truncate font-medium">{leader.email}</span>
                  </a>
                  <a
                    className={`flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg ${leader.hoverColor} transition-colors group`}
                    href={`tel:${leader.phone}`}
                  >
                    <Phone size={18} className={leader.titleColor} />
                    <span className="font-medium">{leader.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
