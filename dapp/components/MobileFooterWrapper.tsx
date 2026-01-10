"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function MobileFooterWrapper() {
  const pathname = usePathname();

  // If we are on the landing page, we don't want the layout-level footer
  // because the landing page has its own footer that flows naturally.
  if (pathname === "/") return null;

  return (
    <div className="md:hidden">
      <Footer />
    </div>
  );
}
