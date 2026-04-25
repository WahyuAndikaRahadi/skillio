"use client";

import { useState } from "react";
import RoadmapTimeline from "./RoadmapTimeline";

export default function RoadmapClientView({ userRoadmap, session }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      <div className="space-y-8">
        {/* Global Header - Hidden when detail is open */}
        {!isDetailOpen && (
          <div className="flex flex-col items-start text-left gap-4 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full shadow-sm mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">
                Kurikulum Aktif
              </span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
                Roadmap Belajar
              </h1>
              <p className="text-slate-500 font-medium text-base">
                Perjalanan 30 hari Anda menguasai bidang{" "}
                <span className="text-skillio-600 font-black">
                  {userRoadmap.category.name}
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="pt-4">
          <RoadmapTimeline
            roadmap={userRoadmap.roadmap}
            userRoadmap={userRoadmap}
            onToggleDetail={(isOpen) => setIsDetailOpen(isOpen)}
          />
        </div>
      </div>
    </div>
  );
}
