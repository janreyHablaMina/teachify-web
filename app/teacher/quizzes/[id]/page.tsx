export default function TeacherQuizDetailsPlaceholder({ params }: { params: { id: string } }) {
  return (
    <div className="w-full">
      <header className="mb-8">
        <p className="m-0 text-[13px] font-bold uppercase tracking-[0.1em] text-slate-500">Dashboard / Quizzes / Details</p>
        <h2 className="text-[32px] font-black leading-none tracking-[-0.03em] text-[#0f172a]">Quiz ID: {params.id}</h2>
      </header>
      
      <div className="rounded-[32px] border-2 border-[#0f172a] bg-white p-12 text-center shadow-[12px_12px_0_#99f6e4]">
        <p className="text-[18px] font-black text-[#0f172a]">Quiz details migration in progress...</p>
        <p className="mt-2 text-slate-500">We are currently migrating the detailed quiz view and analytics.</p>
      </div>
    </div>
  );
}
