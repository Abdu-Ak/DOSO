import React from "react";
import AlumniHeader from "./_components/AlumniHeader";
import AlumniList from "./_components/AlumniList";

export default function AlumniPage() {
  return (
    <>
      <AlumniHeader />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <AlumniList />
      </main>
    </>
  );
}
