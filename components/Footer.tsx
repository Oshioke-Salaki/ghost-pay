import React from "react";

function Footer() {
  return (
    <footer className="py-5 text-center text-white text-sm bg-black">
      © {new Date().getFullYear()} GhostPay. Built on Starknet + Typhoon.
    </footer>
  );
}

export default Footer;
