import Link from "next/link";
import { Plus, Wallet } from "lucide-react";
import { ApplicationShell } from "@/components/layout/application-shell";
export const metadata = { title: "My Agents" };
export default function MyAgentsPage() {
  return (
    <ApplicationShell>
      <div className="max-w-4xl w-full mx-auto px-4 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[--text-primary]">My agents</h1>
          <Link href="/create"
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)" }}>
            <Plus size={14} strokeWidth={2.5} /> Create agent
          </Link>
        </div>
        <div className="card-3d flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--surface-subtle)" }}>
            <Wallet size={22} style={{ color: "var(--text-muted)" }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[--text-primary] mb-1">Connect your wallet</p>
            <p className="text-xs text-[--text-muted]">Your agents, their wallets and earnings live here.</p>
          </div>
          <button disabled className="rounded-lg px-5 py-2 text-sm font-semibold text-white opacity-50 cursor-not-allowed"
            style={{ background: "var(--accent)" }}>
            Connect wallet
          </button>
        </div>
      </div>
    </ApplicationShell>
  );
}
