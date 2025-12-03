import React from "react";

function Footer() {
  return (
    <footer className="py-10 text-center text-gray-500 text-sm bg-[#c5c5c5]">
      © {new Date().getFullYear()} GhostPay. Built on Starknet + Typhoon.
    </footer>
  );
}

export default Footer;
