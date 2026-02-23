import React from "react";
import { Bus, Navigation } from "lucide-react";

export default function CampusMap() {
  return (
    <section className="relative pt-24 pb-0 bg-white dark:bg-background-dark overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-10"></div>
      <div className="max-w-7xl mx-auto px-6 text-center mb-16 relative z-10">
        <h2 className="text-3xl font-serif font-bold mb-4 text-slate-900 dark:text-white">
          Visit Our Campus
        </h2>
        <p className="text-slate-500 font-medium">
          Plan your visit to Darul Hidaya Dars. Our campus is open for tours by
          appointment.
        </p>
      </div>

      <div className="relative h-[550px] w-full group">
        <div className="absolute inset-0 z-10">
          <img
            className="w-full h-full object-cover filter saturate-[0.6] sepia-[0.1]"
            alt="Aerial view of campus with modern buildings and green courtyards"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe1pYRrJgrPtx4Fe7K5ZIjZCvx6D3Sh1vDS_uAfo98JmZHniFAhcdrcx4QiE1LPtWC90M2HXgL8jrXm9i9dK03Z8sXGFiqpeI6ufdqqp3dbykAvp9RkaQf7QgG7cpUKIzlq3BSY4GVtwHyYXuLp8Wl8qQy50SCxNsglC4YPgFD9ivdyWRZgJ6sZoehw7rtgTQIWgOgVoSCJEIJreZy99bGm1lJdAlNJW4ayATq9a5rlDuGFIhh41fqasH23LdHEQK1N86QN8XmKg"
          />
          <div className="absolute inset-0 bg-primary/20 pointer-events-none"></div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-2xl p-8 mosque-arch-card border border-primary/20 max-w-sm w-full">
          <div className="flex items-start gap-5">
            <div className="bg-primary p-4 rounded-xl text-white">
              <Bus size={24} />
            </div>
            <div>
              <h4 className="font-serif font-bold text-xl mb-2">
                Getting Here
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Located 15 mins from Central Station. Free visitor parking
                available on site for all guests.
              </p>
              <button className="bg-primary text-white text-sm font-bold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-primary/95 transition-all w-full justify-center">
                <Navigation size={14} />
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
