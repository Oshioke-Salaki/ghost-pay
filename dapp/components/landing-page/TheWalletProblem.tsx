import { ArrowRight, Ghost, Lock } from "lucide-react";

function TheWalletProblem() {
  return (
    <section className="py-24 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              The "Wallet Watcher" Problem
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              On standard blockchains, once an employee knows your company
              wallet, they can see exactly what everyone else is getting paid.
              This creates internal conflict and exposes your burn rate to
              competitors.
            </p>
            <ul className="space-y-4">
              {[
                "Competitors tracking your expenses",
                "Employees seeing co-worker salaries",
                "Targeted phishing on high-value wallets",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <Lock size={14} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-tr from-gray-200 to-transparent rounded-2xl transform rotate-3"></div>
            <div className="relative bg-white border border-gray-200 p-8 rounded-2xl shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <div className="h-2 w-24 bg-gray-300 rounded"></div>
                  <div className="h-2 w-12 bg-gray-300 rounded"></div>
                </div>
                <div className="flex items-center justify-center py-4">
                  <ArrowRight className="text-gray-300 rotate-90" />
                </div>
                <div className="flex items-center justify-between p-4 bg-black text-white rounded-lg shadow-xl">
                  <div className="flex items-center gap-2">
                    <Ghost size={16} />
                    <span className="font-mono text-sm">Typhoon Mix</span>
                  </div>
                  <div className="text-xs bg-gray-800 px-2 py-1 rounded">
                    ENCRYPTED
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TheWalletProblem;
