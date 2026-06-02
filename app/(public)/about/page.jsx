import React from "react";
import AboutHero from "./_components/AboutHero";
import MissionVision from "./_components/MissionVision";
import CoreValues from "./_components/CoreValues";

export const metadata = {
  title: "About Us",
  description: "Learn about the history, mission, vision, and core values of Darul Hidaya Dars, dedicated to preserving heritage and enlightening minds.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionVision />
      <CoreValues />
    </>
  );
}
