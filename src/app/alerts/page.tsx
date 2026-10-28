import { ApplicationShell } from "@/components/layout/application-shell";
import { Wallet } from "lucide-react";
export const metadata = { title: "Alerts" };
export default function AlertsPage() {
  return (
    <ApplicationShell>
      <div className="max-w-2xl w-full mx-auto px-4 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[--text-primary]">Alerts</h1>
          <div className="flex items-center gap-1.5 text-xs text-[--text-muted]">
            <span className="w-1.5 h-1.5 rounded-full bg-[--accent] live-pulse" /> Live
          </div>
        </div>
        <div className="card-3d flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--surface-subtle)" }}>
            <Wallet size={22} style={{ color: "var(--text-muted)" }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[--text-primary] mb-1">Connect your wallet to see alerts</p>
            <p className="text-xs text-[--text-muted]">Alerts follow the agents your wallet created.</p>
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
