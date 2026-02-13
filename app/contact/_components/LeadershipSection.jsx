import React from "react";
import { AtSign, Smartphone } from "lucide-react";

const LEADERSHIP_DATA = [
  {
    name: "Sheikh Abdullah Omar",
    title: "President",
    email: "president@darulhidaya.edu",
    extension: "101",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXgbK0TQHiHIpfyDIN_e-BJJufvl_9GW5FoCZ-AF9LtQuoGS1cv2rGZUUjp54jXsDyepLqAV140JN1fQj5BMcE8PYfa4v2_Jo573o885ajT7XGSkTreIxjvTXEqqXBnO_VYgBlWgaRUJOCicMtzjKj2PJIFZ4oqfo7CubDMUfZoN36tNeT6qUt8s9USVse-YntXERwUIGZNP_GBeptMMTxL6ZJVgg0m781TCTfbmMtmM_jMI51iaVRiSXeB3kXqCQNoGnJiWGWpQ",
    headerColor: "bg-primary",
    titleColor: "text-primary",
    hoverColor: "hover:bg-primary/5",
  },
  {
    name: "Mr. Ahmed Al-Masri",
    title: "General Secretary",
    email: "secretary@darulhidaya.edu",
    extension: "105",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdF0_Dwq6Z7KNG_AQdFvqErb9SMHabVuX4vaa0gH45p8E24EnfvUEynjJvmsN-QJMNXVMd7ALzYOLYR2xVHbzSUE3UtxOVSODXqA5SIUE0qQMLJoAERq2yoS0uIqXz2lHgdo9AMbxz64PNYZJdswdLny0WRSHtKx17qgOlRK2st7IOpne_VrqR25ii58oJdK0HWqPEIAemJjDn8ECIRHlHoiZYl3xz-9_AfMw2PU_cPOhB6LNb0kQc0BH7Vak3ES0IDVTWmJw0Sg",
    headerColor: "bg-accent-green",
    titleColor: "text-accent-green",
    hoverColor: "hover:bg-accent-green/5",
  },
  {
    name: "Maulana Yusuf Hassan",
    title: "Head Master",
    email: "headmaster@darulhidaya.edu",
    extension: "110",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAEsBOlXNVHfEtmlTuap1Dgtchdwwe74lTGaNMqtjnU7bhpZn1UhhjFhBbi4QTPDgZRLjyXnhN_JX2lF5k0ffhCQ0vc0kJcmi3SkBouZ29nsVXunL3VQuvrt3l-_2-4wc5gH36wgFG5e8vAl_3M5g-VFWm0Uk6yczMrCnlXXR1tlcdn7yRwrC0nagG4jyUk5k6zx8WGsZVot4RaNf6dpFabDpNv6rsNAOO7bRA3FvDgDlxzkqR6yHYUNgLGrW4ubOe8cu-B-Yu8_w",
    headerColor: "bg-primary",
    titleColor: "text-primary",
    hoverColor: "hover:bg-primary/5",
  },
];

export default function LeadershipSection() {
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
                    <AtSign size={18} className={leader.titleColor} />
                    <span className="truncate font-medium">{leader.email}</span>
                  </a>
                  <a
                    className={`flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg ${leader.hoverColor} transition-colors group`}
                    href={`tel:+12345678900`}
                  >
                    <Smartphone size={18} className={leader.titleColor} />
                    <span className="font-medium">Ext: {leader.extension}</span>
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
