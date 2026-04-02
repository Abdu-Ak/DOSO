import React from "react";
import { MapPin, Phone, Mail, Clock, Calendar } from "lucide-react";
import { getSettings } from "@/lib/settings";

export default async function ContactInfo() {
  const settings = await getSettings();
  const { contact } = settings;

  return (
    <div className="lg:sticky lg:top-32">
      <div className="bg-primary text-white p-12 mosque-arch-card shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-10"></div>
        <div className="relative z-10 space-y-8">
          <div>
            <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-3">
              Contact Information
            </h3>
            <h2 className="text-3xl font-serif font-bold">Main Headquarters</h2>
          </div>

          <div className="space-y-7">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                <MapPin size={20} />
              </div>
              <div>
                <p className="font-bold text-lg">Main Campus</p>
                <p className="text-white/80 leading-relaxed whitespace-pre-line">
                  {contact?.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                <Phone size={20} />
              </div>
              <div>
                <p className="font-bold text-lg">Switchboard</p>
                <p className="text-white/80">{contact?.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                <Mail size={20} />
              </div>
              <div>
                <p className="font-bold text-lg">General Enquiries</p>
                <p className="text-white/80">{contact?.email}</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <p className="text-sm font-serif italic text-emerald-200">
              "Seeking knowledge is an obligation upon every Muslim."
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-accent-green/5 dark:bg-accent-green/10 p-5 mosque-arch-card border border-accent-green/20">
          <Clock size={28} className="text-accent-green mb-3" />
          <p className="font-bold text-sm text-accent-green">Working Hours</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
            Mon - Fri: 8am - 4pm
          </p>
        </div>
        <div className="bg-primary/5 dark:bg-primary/10 p-5 mosque-arch-card border border-primary/20">
          <Calendar size={28} className="text-primary mb-3" />
          <p className="font-bold text-sm text-primary">Visit Policy</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
            By Appointment Only
          </p>
        </div>
      </div>
    </div>
  );
}
