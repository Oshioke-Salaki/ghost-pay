import { Code2, FileSpreadsheet, ShieldCheck } from "lucide-react";
import React from "react";

function FeaturesGrid() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-4 text-foreground">
          Enterprise Grade Privacy
        </h2>
        <p className="text-muted-foreground">
          Built for organizations that demand discretion.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <ShieldCheck size={32} />,
            title: "Encrypted Balances",
            desc: "Hold payroll funds in a shielded state. Tongo's homomorphic encryption ensures balances remain private until withdrawal.",
          },
          {
            icon: <FileSpreadsheet size={32} />,
            title: "Selective Disclosure",
            desc: "Prove solvency and payments to auditors without exposing your entire treasury history to the public.",
          },
          {
            icon: <Code2 size={32} />,
            title: "Tongo Protocol",
            desc: "Built on the robust Tongo protocol, utilizing ElGamal encryption and ZK proofs for secure, private transactions.",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="group p-8 rounded-2xl border border-gray-200 hover:border-black transition-colors duration-300 bg-card hover:shadow-lg dark:border-border dark:hover:border-accent/50"
          >
            <div className="mb-6 p-4 bg-muted/50 rounded-xl inline-block group-hover:bg-black group-hover:text-white transition-colors text-accent dark:group-hover:bg-accent dark:group-hover:text-accent-foreground">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-card-foreground">
              {feature.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesGrid;
