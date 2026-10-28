/**
 * ORBYTE — Agent GLB mapping
 *
 * IDs are "agent-01" through "agent-23" (2-digit zero-padded).
 * GLB files are at /agents/agent-01.glb through /agents/agent-23.glb
 *
 * The legacy seed-data uses "agent-001" through "agent-006" (3-digit).
 * getAgentGlb() handles both formats.
 */

// Direct 1-to-1 map for all 23 — no hashing needed
const GLB_MAP: Record<string, string> = {};
for (let i = 1; i <= 23; i++) {
  const twoDigit  = `agent-${String(i).padStart(2, "0")}`;
  const threeDigit = `agent-${String(i).padStart(3, "0")}`;
  const url = `/agents/agent-${String(i).padStart(2, "0")}.glb`;
  GLB_MAP[twoDigit]   = url;
  GLB_MAP[threeDigit] = url;
}

/** All 23 IDs in 2-digit format — used by create wizard */
export const ALL_CHARACTER_IDS: string[] = Array.from(
  { length: 23 },
  (_, i) => `agent-${String(i + 1).padStart(2, "0")}`
);

export function getAgentGlb(agentId?: string): string {
  if (!agentId) return GLB_MAP["agent-01"];
  return GLB_MAP[agentId] ?? GLB_MAP["agent-01"];
}
