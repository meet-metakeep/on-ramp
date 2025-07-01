"use client";

import React from "react";
import { Header } from "./components/Header";
import OnrampFeature from "./components/OnrampFeature";

export default function OnrampPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20">
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 pt-28 pb-16 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-400 tracking-tight">
                Onramp
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Welcome to the Onramp!
              </p>
            </div>
          </div>
        </section>
        <OnrampFeature />
      </main>
    </div>
  );
}
