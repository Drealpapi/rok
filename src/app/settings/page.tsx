import { Settings2 } from "lucide-react";
import { ApplicationShell } from "@/components/layout/application-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <ApplicationShell>
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 lg:px-6 py-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#F5F3FB]">
            <Settings2 className="w-5 h-5 text-[#85859E]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#11111B]">Settings</h1>
            <p className="text-sm text-[#85859E]">Account and application preferences.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Display</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Theme", value: "Light (default)", available: false },
              { label: "Language", value: "English", available: false },
              { label: "Reduced motion", value: "Follows system setting", available: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#EDE9F8] last:border-0">
                <span className="text-sm text-[#11111B]">{item.label}</span>
                <span className="text-sm text-[#85859E]">
                  {item.value}
                  {!item.available && (
                    <span className="ml-2 text-[10px] bg-[#F5F3FB] text-[#85859E] rounded-full px-2 py-0.5">
                      Coming soon
                    </span>
                  )}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "In-app alerts", value: "Enabled" },
              { label: "Email notifications", value: "Not configured", available: false },
              { label: "Browser push", value: "Not configured", available: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#EDE9F8] last:border-0">
                <span className="text-sm text-[#11111B]">{item.label}</span>
                <span className="text-sm text-[#85859E]">
                  {item.value}
                  {"available" in item && !item.available && (
                    <span className="ml-2 text-[10px] bg-[#F5F3FB] text-[#85859E] rounded-full px-2 py-0.5">
                      Coming soon
                    </span>
                  )}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Developer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-[#11111B]">Development mode</span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Active
              </span>
            </div>
            <p className="text-xs text-[#85859E] mt-2 leading-relaxed">
              Development mode is active. All data is simulated. No real transactions or AI inference will occur.
            </p>
          </CardContent>
        </Card>
      </div>
    </ApplicationShell>
  );
}
