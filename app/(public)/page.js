import React from "react";
import HeroStats from "@/components/home/HeroStats";
import HistoryMission from "@/components/home/HistoryMission";
import Leadership from "@/components/home/Leadership";
import Events from "@/components/home/Events";
import Newsletter from "@/components/home/Newsletter";

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
