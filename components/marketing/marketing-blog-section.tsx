import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "./data";

export function MarketingBlogSection() {
  const [featurePost, leftPost, rightPost] = blogPosts;

  return (
    <section id="blog" className="border-b-2 border-slate-900 bg-white px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[0_5px_0_#99f6e4]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-900 bg-teal-100">
              <svg className="h-2.5 w-2.5 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 5.5 13.8 10 18.8 10.3 14.9 13.4 16.2 18.2 12 15.4 7.8 18.2 9.1 13.4 5.2 10.3 10.2 10z" />
              </svg>
            </span>
            <span>FROM THE STAFF ROOM</span>
          </span>
          <h2 className="mt-6 text-[34px] font-black leading-[1.05] tracking-[-0.03em] sm:text-[58px]">
            Fresh ideas for modern <span className="text-rose-300">teaching teams.</span>
          </h2>
        </div>

        <div className="grid items-stretch gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="grid overflow-hidden border-2 border-slate-900 bg-white shadow-[10px_10px_0_#0f172a] lg:grid-cols-2">
            <div className="relative min-h-[260px] border-b-2 border-slate-900 md:border-b-0 md:border-r-2">
              <Image src={featurePost.image} alt={featurePost.title} fill className="object-cover" />
              <span className="absolute left-3 top-3 -rotate-2 border-2 border-slate-900 bg-yellow-200 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.08em]">
                {featurePost.category}
              </span>
            </div>
            <div className="flex flex-col p-6 sm:p-8">
              <span className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">{featurePost.date}</span>
              <h3 className="mb-3 mt-3 text-[30px] font-black leading-[1.1] sm:text-[34px]">{featurePost.title}</h3>
              <p className="mb-6 text-base font-medium leading-[1.65] text-slate-600">{featurePost.excerpt}</p>
              <Link href={featurePost.href} className="group mt-auto inline-flex w-fit items-center gap-2 border-b-4 border-teal-300 pb-0.5 text-sm font-black text-slate-900">
                Read the full story
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </article>

          <div className="grid gap-5 md:grid-rows-2">
            {[leftPost, rightPost].map((post, idx) => (
              <article key={post.title} className={`grid overflow-hidden border-2 border-slate-900 bg-white shadow-[8px_8px_0_rgba(15,23,42,0.25)] lg:grid-cols-[38%_62%] ${idx === 0 ? "md:rotate-[-1deg]" : "md:rotate-[1deg]"}`}>
                <div className="relative min-h-[180px] border-b-2 border-slate-900 md:border-b-0 md:border-r-2">
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col p-4">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">{post.category}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">{post.date}</span>
                  </div>
                  <h4 className="mb-2 text-[21px] font-black leading-[1.15]">{post.title}</h4>
                  <p className="mb-4 text-sm leading-[1.5] text-slate-600">{post.excerpt}</p>
                  <Link href={post.href} className="mt-auto inline-flex w-fit items-center gap-2 border-b-[3px] border-teal-300 pb-0.5 text-sm font-black text-slate-900">
                    Read article
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
