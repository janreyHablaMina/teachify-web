export type Feature = {
  title: string;
  description: string;
  href: string;
  tag?: string;
  tagTone?: "pink" | "teal";
  image: string;
};

export type Plan = {
  tag: string;
  title: string;
  price: string;
  unit?: string;
  description: string;
  features: string[];
  limitations?: string[];
  tone: "yellow" | "teal" | "pink" | "purple";
  popular?: boolean;
  ctaHref: string;
  ctaLabel: string;
  ctaSolid?: boolean;
};

export type BlogPost = {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  href: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  tone: "yellow" | "teal" | "pink";
};
