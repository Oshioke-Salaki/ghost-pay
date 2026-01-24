"use client";
import React from "react";
import TreasuryOverview from "./TreasuryOverview";
import GhostScore from "./GhostScore";
import PersonalStatsGrid from "./PersonalStatsGrid";
import PersonalRecentActivity from "./PersonalRecentActivity";

export default function PersonalOverview() {
  return (
    <>
      <div className="mb-0">
          {/* <GhostScore /> */}
      </div>

      <TreasuryOverview />
      
      <PersonalStatsGrid />

      <PersonalRecentActivity />
    </>
  );
}
