import Image from "next/image";
import Link from "next/link";
import { features } from "./data";

type MarketingFeaturesSectionProps = {
  gochiClassName: string;
};

export function MarketingFeaturesSection({ gochiClassName }: MarketingFeaturesSectionProps) {
  return (
    <section id="features" className="border-b-2 border-slate-900 bg-[#f3f4f8] px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="mx-auto mb-14 max-w-[800px] text-center">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[0_5px_0_#fda4af]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-900 text-[11px] leading-none">
              ✧
            </span>
            <span>WHAT YOU CAN DO</span>
          </span>
          <h2 className="mt-8 text-[34px] font-black leading-[1.1] sm:text-[56px]">
            Tools that actually
            <br />
            <span className={`${gochiClassName} relative inline-block mt-2 text-[#fda4af]`}>
              <span className="absolute inset-x-0 bottom-[16%] h-[58%] bg-[#fef08a] -z-0" />
              <span className="relative z-10 px-1">Save Time.</span>
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-[1.6] font-semibold text-slate-600 sm:text-[19px]">
            We didn&apos;t just build another AI. We built a digital co-pilot for your classroom.
            Move from admin to inspiration in seconds.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className={`relative rounded border-2 border-slate-900 bg-white p-5 transition hover:-translate-x-1 hover:-translate-y-1 ${
                index === 0
                  ? "shadow-[10px_10px_0_#fda4af] hover:shadow-[14px_14px_0_#fda4af]"
                  : index === 1
                    ? "shadow-[10px_10px_0_#99f6e4] hover:shadow-[14px_14px_0_#99f6e4]"
                    : "shadow-[10px_10px_0_#ddd6fe] hover:shadow-[14px_14px_0_#ddd6fe]"
              }`}
            >
              <div className="relative h-52 overflow-hidden border-2 border-slate-900">
                <Image src={feature.image} alt={feature.title} fill className="object-cover" />
                {feature.tag ? (
                  <span className="absolute right-3 top-3 rotate-[-6deg] border border-slate-900 bg-[#f4e3b8] px-2 py-1 text-[10px] font-black">
                    {feature.tag}
                  </span>
                ) : null}
              </div>
              <div className="pt-5">
                <h3 className="text-[24px] font-black text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.6] font-bold text-slate-600">{feature.description}</p>
                <Link href={feature.href} className="mt-6 inline-flex items-center gap-2 text-sm font-black text-slate-900 transition hover:gap-3 hover:text-blue-600">
                  {feature.title === "Quiz Architect" ? "Try Architect" : feature.title === "Lesson Navigator" ? "View Projects" : "See Data"}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <svg width="84" height="44" viewBox="0 0 100 50" fill="none">
            <path d="M10,10 Q50,60 90,10 M90,10 L80,15 M90,10 L85,0" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
