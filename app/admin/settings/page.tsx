"use client";

import { useState } from "react";
import { Provider, FeatureFlags } from "@/components/admin/settings/types";
import { SettingsHeader } from "@/components/admin/settings/settings-header";
import { SettingsPanel, SettingsField } from "@/components/admin/settings/settings-ui";
import { FeatureToggles } from "@/components/admin/settings/feature-toggles";

const inputStyles = "rounded-xl border border-slate-200 bg-[#f8fbff] px-4 py-3 text-sm font-bold text-[#0f172a] outline-none transition-all focus:border-[#99f6e4] focus:bg-white focus:ring-4 focus:ring-teal-500/10";

export default function AdminSettingsPage() {
  const [provider, setProvider] = useState<Provider>("OpenAI");
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({
    aiAssist: true,
    smartHints: true,
    maintenanceMode: false,
    publicSignup: true,
  });

  const handleToggle = (key: keyof FeatureFlags) => {
    setFeatureFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <main className="px-4 pb-8 pt-8 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-8">
        <SettingsHeader />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* AI Settings */}
          <SettingsPanel title="AI provider keys" accentColor="before:bg-[#99f6e4] hover:border-[#99f6e4]">
            <SettingsField label="Default provider">
              <select 
                className={inputStyles}
                value={provider} 
                onChange={(e) => setProvider(e.target.value as Provider)}
              >
                <option>OpenAI</option>
                <option>DeepSeek</option>
                <option>Anthropic</option>
              </select>
            </SettingsField>
            <SettingsField label="OpenAI API key">
              <input className={inputStyles} type="password" value="sk-live-xxxxxx-xxxx" readOnly />
            </SettingsField>
            <SettingsField label="DeepSeek API key">
              <input className={inputStyles} type="password" value="ds-live-xxxxxx-xxxx" readOnly />
            </SettingsField>
          </SettingsPanel>

          {/* Pricing Settings */}
          <SettingsPanel title="Pricing plan configuration" accentColor="before:bg-[#fef08a] hover:border-[#fef08a]">
            <SettingsField label="Basic plan (USD/month)">
              <input className={inputStyles} type="number" defaultValue={7} />
            </SettingsField>
            <SettingsField label="Pro plan (USD/month)">
              <input className={inputStyles} type="number" defaultValue={14} />
            </SettingsField>
            <SettingsField label="School plan (USD/year)">
              <input className={inputStyles} type="number" defaultValue={590} />
            </SettingsField>
          </SettingsPanel>

          {/* Email Settings */}
          <SettingsPanel title="Email settings" accentColor="before:bg-[#fda4af] hover:border-[#fda4af]">
            <SettingsField label="SMTP host">
              <input className={inputStyles} defaultValue="smtp.mail.teachify.com" />
            </SettingsField>
            <SettingsField label="Sender address">
              <input className={inputStyles} defaultValue="no-reply@teachify.com" />
            </SettingsField>
            <SettingsField label="Support address">
              <input className={inputStyles} defaultValue="support@teachify.com" />
            </SettingsField>
          </SettingsPanel>

          {/* Storage Settings */}
          <SettingsPanel title="Storage settings" accentColor="before:bg-[#e9d5ff] hover:border-[#e9d5ff]">
            <SettingsField label="Provider">
              <input className={inputStyles} defaultValue="AWS S3" />
            </SettingsField>
            <SettingsField label="Bucket">
              <input className={inputStyles} defaultValue="teachify-prod-assets" />
            </SettingsField>
            <SettingsField label="Retention policy">
              <input className={inputStyles} defaultValue="365 days" />
            </SettingsField>
          </SettingsPanel>

          {/* Branding Settings */}
          <SettingsPanel title="Platform branding" accentColor="before:bg-sky-400 hover:border-sky-400">
            <SettingsField label="Platform name">
              <input className={inputStyles} defaultValue="Teachify" />
            </SettingsField>
            <SettingsField label="Primary color">
              <input className={inputStyles} defaultValue="#0f172a" />
            </SettingsField>
            <SettingsField label="Secondary color">
              <input className={inputStyles} defaultValue="#14b8a6" />
            </SettingsField>
          </SettingsPanel>

          {/* Feature Toggles */}
          <FeatureToggles flags={featureFlags} onToggle={handleToggle} />
        </div>
      </div>
    </main>
  );
}
