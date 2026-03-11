"use client";

import { useState } from "react";
import styles from "./settings.module.css";

type Provider = "OpenAI" | "DeepSeek" | "Anthropic";

export default function AdminSettingsPage() {
  const [provider, setProvider] = useState<Provider>("OpenAI");
  const [featureFlags, setFeatureFlags] = useState({
    aiAssist: true,
    smartHints: true,
    maintenanceMode: false,
    publicSignup: true,
  });

  return (
    <section className={styles.root}>
      <header className={styles.missionHeader}>
        <div className={styles.missionTitle}>
          <p className={styles.missionBreadcrumb}>Admin / Configuration</p>
          <h2>Platform Settings</h2>
        </div>
      </header>

      <section className={styles.grid}>
        <article className={styles.panel}>
          <h4>AI provider keys</h4>
          <div className={styles.field}>
            <label>Default provider</label>
            <select value={provider} onChange={(event) => setProvider(event.target.value as Provider)}>
              <option>OpenAI</option>
              <option>DeepSeek</option>
              <option>Anthropic</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>OpenAI API key</label>
            <input type="password" value="sk-live-xxxxxx-xxxx" readOnly />
          </div>
          <div className={styles.field}>
            <label>DeepSeek API key</label>
            <input type="password" value="ds-live-xxxxxx-xxxx" readOnly />
          </div>
        </article>

        <article className={styles.panel}>
          <h4>Pricing plan configuration</h4>
          <div className={styles.field}>
            <label>Basic plan (USD/month)</label>
            <input type="number" defaultValue={7} />
          </div>
          <div className={styles.field}>
            <label>Pro plan (USD/month)</label>
            <input type="number" defaultValue={14} />
          </div>
          <div className={styles.field}>
            <label>School plan (USD/year)</label>
            <input type="number" defaultValue={590} />
          </div>
        </article>

        <article className={styles.panel}>
          <h4>Email settings</h4>
          <div className={styles.field}>
            <label>SMTP host</label>
            <input defaultValue="smtp.mail.teachify.com" />
          </div>
          <div className={styles.field}>
            <label>Sender address</label>
            <input defaultValue="no-reply@teachify.com" />
          </div>
          <div className={styles.field}>
            <label>Support address</label>
            <input defaultValue="support@teachify.com" />
          </div>
        </article>

        <article className={styles.panel}>
          <h4>Storage settings</h4>
          <div className={styles.field}>
            <label>Provider</label>
            <input defaultValue="AWS S3" />
          </div>
          <div className={styles.field}>
            <label>Bucket</label>
            <input defaultValue="teachify-prod-assets" />
          </div>
          <div className={styles.field}>
            <label>Retention policy</label>
            <input defaultValue="365 days" />
          </div>
        </article>

        <article className={styles.panel}>
          <h4>Platform branding</h4>
          <div className={styles.field}>
            <label>Platform name</label>
            <input defaultValue="Teachify" />
          </div>
          <div className={styles.field}>
            <label>Primary color</label>
            <input defaultValue="#0f172a" />
          </div>
          <div className={styles.field}>
            <label>Secondary color</label>
            <input defaultValue="#14b8a6" />
          </div>
        </article>

        <article className={styles.panel}>
          <h4>Feature toggles</h4>
          <ul className={styles.toggleList}>
            <li>
              <span>AI Assistant</span>
              <button
                type="button"
                className={!featureFlags.aiAssist ? styles.off : ""}
                onClick={() => setFeatureFlags((p) => ({ ...p, aiAssist: !p.aiAssist }))}
              >
                {featureFlags.aiAssist ? "Active" : "Disabled"}
              </button>
            </li>
            <li>
              <span>Smart Hints</span>
              <button
                type="button"
                className={!featureFlags.smartHints ? styles.off : ""}
                onClick={() => setFeatureFlags((p) => ({ ...p, smartHints: !p.smartHints }))}
              >
                {featureFlags.smartHints ? "Active" : "Disabled"}
              </button>
            </li>
            <li>
              <span>Maintenance Mode</span>
              <button
                type="button"
                className={!featureFlags.maintenanceMode ? styles.off : ""}
                onClick={() => setFeatureFlags((p) => ({ ...p, maintenanceMode: !p.maintenanceMode }))}
              >
                {featureFlags.maintenanceMode ? "Active" : "Disabled"}
              </button>
            </li>
            <li>
              <span>Public Signup</span>
              <button
                type="button"
                className={!featureFlags.publicSignup ? styles.off : ""}
                onClick={() => setFeatureFlags((p) => ({ ...p, publicSignup: !p.publicSignup }))}
              >
                {featureFlags.publicSignup ? "Active" : "Disabled"}
              </button>
            </li>
          </ul>
        </article>
      </section>
    </section>
  );
}
