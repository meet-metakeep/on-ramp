"use client";

import React from "react";
import { Header } from "./components/Header";
import OnrampFeature from "./components/OnrampFeature";

export default function OnrampPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="pt-20">
        <OnrampFeature />
      </main>
    </div>
  );
}
