import { ArrowRight, Ghost, Lock } from "lucide-react";

function TheWalletProblem() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              The "Public Ledger" Problem
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              On standard blockchains, your entire financial history is public.
              Every payment you make reveals your net worth, your habits, and
              your connections to anyone watching the chain.
            </p>
            <ul className="space-y-4">
              {[
                "Competitors tracking your treasury movements",
                "Targeted phishing on high-net-worth wallets",
                "Loss of leverage in salary or business negotiations",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <div className="h-6 w-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20">
                    <Lock size={14} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent rounded-2xl transform rotate-3 blur-xl opacity-50"></div>
            <div className="relative bg-card border border-border p-8 rounded-2xl shadow-xl">
              <div className="space-y-4">
                {/* Public View */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-dashed border-border/50">
                  <div className="space-y-2">
                    <div className="h-2 w-24 bg-muted-foreground/20 rounded"></div>
                    <div className="h-2 w-32 bg-muted-foreground/20 rounded"></div>
                  </div>
                  <div className="text-xs text-red-400 font-mono">VISIBLE</div>
                </div>

                <div className="flex items-center justify-center py-4 text-muted-foreground">
                  <ArrowRight className="rotate-90" />
                </div>

                {/* Tongo View */}
                <div className="flex items-center justify-between p-4 bg-[#0A0A0A] text-white rounded-lg shadow-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/20 rounded-lg text-accent">
                      <Ghost size={16} />
                    </div>
                    <div>
                      <span className="font-mono text-sm block">
                        Tongo Shield
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Homomorphic Encryption
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] bg-accent/10 text-accent px-2 py-1 rounded border border-accent/20 font-bold tracking-wider">
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
