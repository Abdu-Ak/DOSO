import React from "react";
import { Mail, MapPin, Briefcase, GraduationCap, Phone } from "lucide-react";

export default function AlumniCard({
  alumni,
  onViewDetails,
  gradientFrom = "primary",
  occupationColor = "primary",
}) {
  const {
    name,
    batch,
    current_job,
    custom_job,
    education,
    address,
    email,
    phone,
    image,
    job_location,
  } = alumni;
  const occupation = current_job || custom_job || "Alumni";
  const displayImage =
    image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  const gradientClasses = {
    primary: "from-primary/20 to-primary/5",
    teal: "from-teal-600/20 to-teal-600/5",
    orange: "from-orange-600/20 to-orange-600/5",
    indigo: "from-indigo-600/20 to-indigo-600/5",
    emerald: "from-emerald-600/20 to-emerald-600/5",
    purple: "from-purple-600/20 to-purple-600/5",
  };

  const occupationColorClasses = {
    primary: "text-primary bg-primary/10",
    teal: "text-teal-700 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-300",
    orange:
      "text-orange-700 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-300",
    indigo:
      "text-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300",
    emerald:
      "text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-300",
    purple:
      "text-purple-700 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300",
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
      {/* Header Gradient */}
      <div
        className={`h-24 bg-gradient-to-r ${gradientClasses[gradientFrom]} relative`}
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      <div className="px-5 pb-6 relative">
        {/* Profile Image */}
        <div className="w-20 h-20 mx-auto -mt-10 rounded-full border-4 border-surface-light dark:border-surface-dark overflow-hidden bg-white shadow-md relative z-10">
          <img
            alt={`Portrait of ${name}`}
            className="w-full h-full object-cover"
            src={displayImage}
          />
        </div>

        {/* Content */}
        <div className="text-center mt-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Batch of {batch}
          </p>

          {/* Occupation Badge */}
          <div
            className={`mt-3 flex items-center justify-center gap-1 text-sm font-medium ${occupationColorClasses[occupationColor]} py-1 px-2 rounded-full mx-auto w-fit`}
          >
            <Briefcase size={18} className="shrink-0" />
            <span>{occupation}</span>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 mt-3 space-y-1">
            {education && (
              <p className="flex items-center justify-center gap-1.5 truncate">
                <GraduationCap size={12} className="shrink-0" />
                <span className="truncate">{education}</span>
              </p>
            )}
            {address && (
              <p className="flex items-center justify-center gap-1.5 truncate">
                <MapPin size={12} className="shrink-0" />
                <span className="truncate">{address}</span>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex gap-2">
            {email && (
              <a
                className="text-slate-400 hover:text-primary transition-colors cursor-pointer"
                href={`mailto:${email}`}
                title="Email"
              >
                <Mail size={18} />
              </a>
            )}
            {phone && (
              <a
                className="text-slate-400 hover:text-primary transition-colors cursor-pointer"
                href={`tel:${phone}`}
                title="Phone"
              >
                <Phone size={18} />
              </a>
            )}
          </div>
          <button
            onClick={onViewDetails}
            className="text-xs font-bold text-primary hover:underline"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
