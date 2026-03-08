const cards = [
  { label: "Total Users", value: "1,284", delta: "+4.2%" },
  { label: "Active Teachers", value: "326", delta: "+1.1%" },
  { label: "Quizzes Today", value: "412", delta: "+8.4%" },
  { label: "MRR", value: "$4,180", delta: "+2.6%" },
];

export default function AdminDashboardPage() {
  return (
    <section className="grid gap-4">
      <div>
        <h3 className="display text-2xl font-semibold">Operations overview</h3>
        <p className="muted mt-1 text-sm">Live status of platform operations and growth signals.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="surface rounded-xl p-4">
            <p className="text-xs font-medium uppercase tracking-[0.06em] text-[var(--muted)]">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#0f172a]">{card.value}</p>
            <p className="mt-1 text-xs font-semibold text-emerald-600">{card.delta}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <article className="surface rounded-xl p-4">
          <h4 className="text-base font-semibold text-[#0f172a]">Alert Stream</h4>
          <ul className="muted mt-3 space-y-2 text-sm">
            <li>Plan upgrade completed</li>
            <li>Queue depth normal</li>
            <li>No failed jobs in 1h</li>
            <li>Backup synced</li>
          </ul>
        </article>

        <article className="surface rounded-xl p-4">
          <h4 className="text-base font-semibold text-[#0f172a]">Pipeline Health</h4>
          <div className="mt-3 grid gap-2 sm:grid-cols-3 text-sm">
            <div className="rounded-lg border border-[var(--line)] bg-white p-3">
              <p className="muted text-xs">API Latency</p>
              <p className="mt-1 text-lg font-semibold text-[#0f172a]">140ms</p>
            </div>
            <div className="rounded-lg border border-[var(--line)] bg-white p-3">
              <p className="muted text-xs">DB Load</p>
              <p className="mt-1 text-lg font-semibold text-[#0f172a]">62%</p>
            </div>
            <div className="rounded-lg border border-[var(--line)] bg-white p-3">
              <p className="muted text-xs">Uptime</p>
              <p className="mt-1 text-lg font-semibold text-[#0f172a]">99.95%</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
