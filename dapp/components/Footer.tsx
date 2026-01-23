import { Ghost } from "lucide-react";

function Footer() {
  return (
    <footer
      className={`border-t transition-colors duration-300 bg-white border-gray-200 text-gray-500`}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div
              className={`flex items-center gap-2 font-bold text-lg text-gray-900`}
            >
              <Ghost size={20} /> GhostPay
            </div>
            <p className="text-sm opacity-80">
              Private payroll infrastructure for the Starknet ecosystem.
            </p>
          </div>


        </div>

        <div
          className={`mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center text-sm border-gray-100`}
        >
          <p>© {new Date().getFullYear()} GhostPay Inc.</p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <span
              className={`cursor-pointer transition-colors hover:text-black`}
            >
              Powered by Tongo cash
            </span>
            <span
              className={`cursor-pointer transition-colors hover:text-black`}
            >
              Built on Starknet
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
