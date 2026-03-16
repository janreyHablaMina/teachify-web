"use client";

const subjectMix = [
  { name: "Math", percent: 40 },
  { name: "Science", percent: 30 },
  { name: "English", percent: 20 },
  { name: "Social Studies", percent: 15 },
  { name: "Others", percent: 10 },
];

export function PopularSubjects() {
  return (
    <article className="relative flex flex-col gap-6 overflow-hidden rounded-[24px] border border-slate-900/10 bg-white p-7 shadow-sm before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[#99f6e4]">
      <div className="flex items-center justify-between">
        <h4 className="m-0 text-[20px] font-black tracking-tight text-[#0f172a]">Most popular subjects</h4>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-500">Distribution by use</span>
      </div>
      
      <ul className="m-0 flex list-none flex-col gap-5 p-0">
        {subjectMix.map((subject) => (
          <li key={subject.name} className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <strong className="text-[15px] font-extrabold text-[#0f172a]">{subject.name}</strong>
              <span className="text-[14px] font-black text-[#0f172a]">{subject.percent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#99f6e4] to-[#14b8a6]" 
                style={{ width: `${subject.percent}%` }} 
              />
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
