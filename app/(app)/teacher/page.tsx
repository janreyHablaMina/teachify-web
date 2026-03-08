const cards = [
  { label: "Quizzes Created", value: "42", delta: "+5" },
  { label: "Active Classes", value: "5", delta: "Stable" },
  { label: "Assigned This Week", value: "9", delta: "+2" },
  { label: "Avg Score", value: "81%", delta: "+3%" },
];

export default function TeacherDashboardPage() {
  return (
    <section className="grid gap-4">
      <div>
        <h3 className="display text-2xl font-semibold">Classroom overview</h3>
        <p className="muted mt-1 text-sm">Realtime status of quizzes, submissions, and review load.</p>
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
          <h4 className="text-base font-semibold text-[#0f172a]">Live Class Feed</h4>
          <ul className="muted mt-3 space-y-2 text-sm">
            <li>5A submitted quiz 03</li>
            <li>2 essays need review</li>
            <li>New quiz draft saved</li>
            <li>Reminder sent to class 6B</li>
          </ul>
        </article>

        <article className="surface rounded-xl p-4">
          <h4 className="text-base font-semibold text-[#0f172a]">Performance</h4>
          <div className="mt-3 grid gap-2 sm:grid-cols-3 text-sm">
            <div className="rounded-lg border border-[var(--line)] bg-white p-3">
              <p className="muted text-xs">Engagement</p>
              <p className="mt-1 text-lg font-semibold text-[#0f172a]">87%</p>
            </div>
            <div className="rounded-lg border border-[var(--line)] bg-white p-3">
              <p className="muted text-xs">On-time</p>
              <p className="mt-1 text-lg font-semibold text-[#0f172a]">91%</p>
            </div>
            <div className="rounded-lg border border-[var(--line)] bg-white p-3">
              <p className="muted text-xs">Pending Reviews</p>
              <p className="mt-1 text-lg font-semibold text-[#0f172a]">3</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
