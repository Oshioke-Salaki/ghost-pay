import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { StarknetProvider } from "@/components/Providers";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import MobileFooterWrapper from "@/components/MobileFooterWrapper";

export const metadata: Metadata = {
  title: "GhostPay | Private Starknet Payroll",
  description:
    "The privacy-first payroll protocol on Starknet. Disburse salaries and payments confidentially using ZK-proofs and the Tongo.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👻</text></svg>",
  },
};

const clashGroteskFont = localFont({
  src: [
    {
      path: "../public/fonts/ClashGrotesk-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashGrotesk-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashGrotesk-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashGrotesk-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashGrotesk-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashGrotesk-Extralight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashGrotesk-Variable.woff2",
      weight: "100",
      style: "normal",
    },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`antialiased relative ${clashGroteskFont.className}`}
      >
        <StarknetProvider>
          <div className="flex h-screen bg-white">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto bg-white p-6 relative">
                {children}
              </main>
              {/* Footer removed from here or moved inside main if needed, but per design usually sidebar layouts have minimal footer or it's at bottom of main */}
              <MobileFooterWrapper />
            </div>
          </div>
          <Toaster position="bottom-right" />
        </StarknetProvider>
      </body>
    </html>
  );
}
