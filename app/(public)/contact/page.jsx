import React from "react";
import ContactForm from "./_components/ContactForm";
import ContactInfo from "./_components/ContactInfo";
import LeadershipSection from "./_components/LeadershipSection";
import CampusMap from "./_components/CampusMap";

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 islamic-pattern"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start relative z-10">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>

      <LeadershipSection />
      <CampusMap />
    </main>
  );
}
