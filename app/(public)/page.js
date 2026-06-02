import React from "react";
import HeroStats from "@/components/home/HeroStats";
import HistoryMission from "@/components/home/HistoryMission";
import Leadership from "@/components/home/Leadership";
import Events from "@/components/home/Events";
import Newsletter from "@/components/home/Newsletter";

export const metadata = {
  title: "Home",
  description: "Welcome to Darul Hidaya Dars, a center for Islamic excellence where traditional knowledge meets modern understanding in an environment of spiritual growth.",
};

export default function Home() {
  return (
    <>
      <HeroStats />
      <HistoryMission />
      <Leadership />
      <Events />
      {/* <Newsletter /> */}
    </>
  );
}
