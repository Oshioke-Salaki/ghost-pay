import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { StarknetProvider } from "@/components/Providers";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "GhostPay | Private Starknet Payroll",
  description:
    "The privacy-first payroll protocol on Starknet. Disburse salaries and payments confidentially using ZK-proofs and the Typhoon SDK.",
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
          <div className="flex flex-col min-h-screen relative">
            <Navbar />
            <main className="flex-1 overflow-y-auto">{children}</main>
            <Footer />
          </div>
        </StarknetProvider>
      </body>
    </html>
  );
}
