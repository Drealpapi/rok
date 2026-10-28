import { Rocket } from "lucide-react";
import { ApplicationShell } from "@/components/layout/application-shell";
import { TokenCard } from "@/components/coins/token-card";
import { SEED_TOKENS, SEED_AGENTS } from "@/lib/seed-data";

export const metadata = { title: "Launches" };

const agentMap = Object.fromEntries(SEED_AGENTS.map((a) => [a.id, a]));

// Show only locked and recently opened tokens as "launches"
const launches = [...SEED_TOKENS]
  .filter((t) => t.status !== "graduated")
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

export default function LaunchesPage() {
  return (
    <ApplicationShell>
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 lg:px-6 py-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#F5F3FB]">
            <Rocket className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#11111B]">Launches</h1>
            <p className="text-sm text-[#85859E]">
              Active token launches — locked pools and recently opened tokens.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
          <p className="text-xs text-amber-800">
            <strong>Development mode</strong> — all launch data is simulated. Pool progress does not reflect real on-chain state.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {launches.map((token) => (
            <TokenCard
              key={token.id}
              token={token}
              agent={agentMap[token.launchingAgentId]}
            />
          ))}
        </div>
      </div>
    </ApplicationShell>
  );
}
