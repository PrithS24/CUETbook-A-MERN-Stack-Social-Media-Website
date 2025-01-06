"use client";
import React from "react";
import Header from "../components/Header";
import StorySection from "@/app/story/StorySection";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-background">
      <Header />
      <main className="flex flex-1 pt-16">
        <div className="flex-1 px-4 py-6 lg:max-w-2xl xl:max-w-3xl mx-auto">
          <div className="lg:ml-2 xl:ml-28">
            <StorySection />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
