import { Code2, FileSpreadsheet, ShieldCheck } from "lucide-react";
import React from "react";

function FeaturesGrid() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-4">Enterprise Grade Privacy</h2>
        <p className="text-gray-600">
          Built for organizations that demand discretion.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <ShieldCheck size={32} />,
            title: "ZK-Proof Privacy",
            desc: "Leveraging Starknet's zero-knowledge capabilities to sever the link between sender and receiver.",
          },
          {
            icon: <FileSpreadsheet size={32} />,
            title: "Batch CSV Upload",
            desc: "Don't send one by one. Upload your entire payroll roster and execute in a single flow.",
          },
          {
            icon: <Code2 size={32} />,
            title: "Typhoon SDK",
            desc: "Built on top of the proven Typhoon protocol, ensuring your funds are secure within the anonymity set.",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="group p-8 rounded-2xl border border-gray-200 hover:border-black transition-colors duration-300 bg-white hover:shadow-lg"
          >
            <div className="mb-6 p-4 bg-gray-50 rounded-xl inline-block group-hover:bg-black group-hover:text-white transition-colors">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesGrid;
