import Link from "next/link";
import { plans } from "./data";

const pricingCardTone: Record<string, string> = {
  yellow:
    "bg-[linear-gradient(170deg,#ffffff_0%,#fffbeb_100%)] xl:rotate-[-1.8deg] shadow-[8px_8px_0_#0f172a] hover:shadow-[12px_12px_0_#0f172a]",
  teal:
    "bg-[linear-gradient(170deg,#ffffff_0%,#eff6ff_100%)] xl:rotate-[-0.8deg] shadow-[8px_8px_0_#0f172a] hover:shadow-[12px_12px_0_#0f172a]",
  pink:
    "border-[3px] bg-[linear-gradient(170deg,#ffffff_0%,#ecfdf5_100%)] xl:rotate-[0.6deg] shadow-[12px_12px_0_#99f6e4] hover:shadow-[16px_16px_0_#99f6e4] xl:z-10",
  purple:
    "bg-[linear-gradient(170deg,#ffffff_0%,#faf5ff_100%)] xl:rotate-[1.6deg] shadow-[8px_8px_0_#0f172a] hover:shadow-[12px_12px_0_#0f172a]",
};

export function MarketingPricingSection() {
  return (
    <section id="pricing" className="border-b-2 border-slate-900 bg-[linear-gradient(90deg,#f7f7ef_0%,#fffef8_100%)] px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="mx-auto mb-12 max-w-4xl text-center sm:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[0_5px_0_#fda4af]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-900 bg-yellow-100">
              <svg className="h-2.5 w-2.5 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 5.5 13.8 10 18.8 10.3 14.9 13.4 16.2 18.2 12 15.4 7.8 18.2 9.1 13.4 5.2 10.3 10.2 10z" />
              </svg>
            </span>
            <span>PRICING</span>
          </span>
          <h2 className="mt-6 text-[34px] font-black leading-[1.06] tracking-[-0.03em] sm:mt-7 sm:text-[58px]">
            Choose the plan that fits your
            <br />
            teaching workflow.
          </h2>
        </div>

        <div className="grid items-stretch gap-[22px] md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.title}
              className={`relative flex flex-col border-2 border-slate-900 p-5 transition-all duration-200 ease-out hover:-translate-y-1.5 sm:p-7 ${pricingCardTone[plan.tone]}`}
            >
              {plan.popular ? (
                <div className="absolute -top-3.5 left-5 rotate-[-3deg] border border-slate-900 bg-slate-900 px-3 py-1 text-[11px] font-black uppercase tracking-[0.07em] text-white">
                  Most Popular
                </div>
              ) : null}

              <span className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{plan.tag}</span>
              <h3 className="mb-2 text-[30px] font-black leading-[1.1] text-slate-900">{plan.title}</h3>

              <div className="mb-2 flex items-end gap-2">
                <strong className="text-[44px] font-black leading-none text-slate-900">{plan.price}</strong>
                {plan.unit ? <span className="pb-1 text-sm font-extrabold text-slate-500/80">{plan.unit}</span> : null}
              </div>

              <p className="mb-4 text-[13px] font-bold leading-[1.5] text-slate-700">{plan.description}</p>

              <div className="mb-4">
                <h4 className="mb-2 text-[11px] font-black uppercase tracking-[0.09em] text-slate-900">Features</h4>
                <ul className="space-y-[9px]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 pl-0 text-[13px] font-bold leading-[1.35] text-slate-900">
                      <span className="mt-[7px] inline-block h-2 w-2 rounded-full bg-rose-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.limitations?.length ? (
                <div className="mb-4 mt-0">
                  <h4 className="mb-2 text-[11px] font-black uppercase tracking-[0.09em] text-slate-900">Limitations</h4>
                  <ul className="space-y-[9px]">
                    {plan.limitations.map((limitation) => (
                      <li key={limitation} className="flex items-start gap-2 text-[13px] font-bold leading-[1.35] text-slate-700">
                        <span className="mt-[7px] inline-block h-2 w-2 rounded-full bg-slate-400" />
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <Link
                href={plan.ctaHref}
                className={`mt-auto inline-flex w-full items-center justify-center border-2 border-slate-900 px-4 py-3 text-[15px] font-black transition-all duration-200 ${
                  plan.ctaSolid
                    ? "bg-slate-900 text-white shadow-[4px_4px_0_#fda4af] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#fda4af]"
                    : "bg-white text-slate-900 hover:bg-violet-200"
                }`}
              >
                {plan.ctaLabel}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
