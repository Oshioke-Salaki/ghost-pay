import React from "react";

function HowItWorks() {
  return (
    <section className="py-24 bg-card dark:bg-black text-card-foreground dark:text-white border-y border-border dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Privacy Protocol
          </h2>
          <p className="text-muted-foreground dark:text-gray-400 mt-2 max-w-xl">
            Four steps to complete financial confidentiality on Starknet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Initialize Identity",
              desc: "Sign a message to derive your Tongo keys. This creates your encrypted identity without needing a separate seed phrase.",
            },
            {
              step: "02",
              title: "Wrap Assets",
              desc: "Deposit public ERC20 tokens (STRK/ETH) into the Tongo contract. They are converted into encrypted 'Tongo Units'.",
            },
            {
              step: "03",
              title: "Private Transfer",
              desc: "Send encrypted funds to other Tongo accounts. The amounts are hidden using homomorphic encryption.",
            },
            {
              step: "04",
              title: "Withdraw",
              desc: "Unwrap your private balance back to any public wallet. The link between source and destination is severed.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="relative pl-8 md:pl-0 pt-0 md:pt-8 border-l md:border-l-0 md:border-t border-border dark:border-neutral-800 group transition-colors"
            >
              <span className="absolute left-[-11px] top-0 md:top-[-11px] md:left-0 h-5 w-5 rounded-full bg-card dark:bg-black border-4 border-border dark:border-neutral-800 group-hover:border-accent transition-colors"></span>
              <div className="text-4xl font-mono font-bold text-muted-foreground/30 dark:text-neutral-800 mb-4 group-hover:text-accent transition-colors">
                {item.step}
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground dark:text-white">
                {item.title}
              </h3>
              <p className="text-muted-foreground dark:text-gray-400 text-sm leading-relaxed">
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
