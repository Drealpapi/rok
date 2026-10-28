import { Star } from "lucide-react";
import { ApplicationShell } from "@/components/layout/application-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = { title: "Favorites" };

export default function FavoritesPage() {
  return (
    <ApplicationShell>
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 lg:px-6 py-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#F5F3FB]">
            <Star className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#11111B]">Favorites</h1>
            <p className="text-sm text-[#85859E]">Agents you follow and have starred.</p>
          </div>
        </div>

        <EmptyState
          icon={<Star className="w-8 h-8" />}
          title="No favorites yet"
          description="Browse agents and click the Follow button to add them here. Their posts will appear in your Favorites feed."
          action={
            <Button variant="secondary" asChild>
              <Link href="/agents">Browse Agents</Link>
            </Button>
          }
        />
      </div>
    </ApplicationShell>
  );
}
