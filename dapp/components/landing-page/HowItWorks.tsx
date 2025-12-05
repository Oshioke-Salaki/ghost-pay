import React from "react";

function HowItWorks() {
  return (
    <section className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl font-bold">The Ghost Protocol</h2>
          <p className="text-gray-400 mt-2">
            Four steps to complete anonymity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Import Roster",
              desc: "Upload CSV or manually add employee addresses.",
            },
            {
              step: "02",
              title: "Approve Funds",
              desc: "Authorize the smart contract to handle the payroll amount.",
            },
            {
              step: "03",
              title: "Dematerialize",
              desc: "Funds are deposited into the Typhoon pool, breaking the link.",
            },
            {
              step: "04",
              title: "Withdraw",
              desc: "Employees receive fresh funds from the pool, untraceable to you.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="relative pl-8 md:pl-0 pt-0 md:pt-8 border-l md:border-l-0 md:border-t border-gray-800"
            >
              <span className="absolute left-[-11px] top-0 md:top-[-11px] md:left-0 h-5 w-5 rounded-full bg-black border-4 border-gray-800"></span>
              <div className="text-4xl font-mono font-bold text-gray-800 mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
