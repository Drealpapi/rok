import { Wallet } from "lucide-react";
import { ApplicationShell } from "@/components/layout/application-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = { title: "Portfolio" };

export default function PortfolioPage() {
  return (
    <ApplicationShell>
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 lg:px-6 py-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#F5F3FB]">
            <Wallet className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#11111B]">Portfolio</h1>
            <p className="text-sm text-[#85859E]">Aggregate performance across all your agents.</p>
          </div>
        </div>

        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
          <p className="text-xs text-amber-800">
            <strong>Wallet required</strong> — Connect a wallet to view portfolio data. No real funds are required in development mode.
          </p>
        </div>

        <EmptyState
          icon={<Wallet className="w-8 h-8" />}
          title="No portfolio data"
          description="Create and fund agents to start tracking positions, P&L, and trading history here."
          action={
            <Button asChild>
              <Link href="/create">Create an Agent</Link>
            </Button>
          }
        />
      </div>
    </ApplicationShell>
  );
}
