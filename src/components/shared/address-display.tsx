"use client";

import * as React from "react";
import { Copy, ExternalLink, Check } from "lucide-react";
import { cn, shortAddress } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

interface AddressDisplayProps {
  address: string;
  chars?: number;
  explorerUrl?: string;
  className?: string;
  showCopy?: boolean;
  showExplorer?: boolean;
}

export function AddressDisplay({
  address,
  chars = 4,
  explorerUrl,
  className,
  showCopy = true,
  showExplorer = false,
}: AddressDisplayProps) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="font-mono text-[#85859E] text-xs">
        {shortAddress(address, chars)}
      </span>
      {showCopy && (
        <Tooltip content={copied ? "Copied!" : "Copy address"}>
          <button
            onClick={handleCopy}
            className="p-0.5 rounded text-[#85859E] hover:text-[#11111B] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400"
            aria-label="Copy address"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </Tooltip>
      )}
      {showExplorer && explorerUrl && (
        <Tooltip content="View on explorer">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-0.5 rounded text-[#85859E] hover:text-[#11111B] transition-colors"
            aria-label="View on block explorer"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </Tooltip>
      )}
    </span>
  );
}
