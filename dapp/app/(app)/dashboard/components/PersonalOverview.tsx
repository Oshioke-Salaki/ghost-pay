"use client";
import React, { useState } from "react";
import SwapModal from "@/components/SwapModal";
import PersonalStatsGrid from "./PersonalStatsGrid";
import PersonalRecentActivity from "./PersonalRecentActivity";

export default function PersonalOverview() {
  const [showSwap, setShowSwap] = useState(false);

  return (
    <>
      <SwapModal isOpen={showSwap} onClose={() => setShowSwap(false)} />
      <PersonalStatsGrid setShowSwap={setShowSwap} />
      <PersonalRecentActivity />
    </>
  );
}
