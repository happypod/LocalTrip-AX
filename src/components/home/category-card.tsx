import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  subtitle: string;
  href: string;
  icon?: React.ReactNode;
  category: "stay" | "experience" | "program" | "course";
}

export function CategoryCard({ title, subtitle, href, icon, category }: CategoryCardProps) {
  const categoryStyles = {
    stay: "from-sky-100/95 via-white/80 to-white/60 shadow-sky-200/80",
    experience: "from-emerald-100/95 via-white/80 to-white/60 shadow-emerald-200/80",
    program: "from-amber-100/95 via-white/80 to-white/60 shadow-amber-200/80",
    course: "from-violet-100/95 via-white/80 to-white/60 shadow-violet-200/80",
  };

  const iconStyles = {
    stay: "text-sky-950 ring-sky-200/70 shadow-sky-200/70",
    experience: "text-emerald-950 ring-emerald-200/70 shadow-emerald-200/70",
    program: "text-amber-950 ring-amber-200/70 shadow-amber-200/70",
    course: "text-violet-950 ring-violet-200/70 shadow-violet-200/70",
  };

  return (
    <Link
      href={href}
      className={cn(
        "group flex min-h-[128px] flex-col items-center justify-center rounded-2xl border border-white/75 bg-gradient-to-br p-5 text-center text-[#161d1f] shadow-[0_18px_45px_-24px] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px]",
        categoryStyles[category],
      )}
    >
      <div
        className={cn(
          "mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/55 ring-1 shadow-[0_14px_32px_-22px] backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:bg-white/75",
          iconStyles[category],
        )}
      >
        {icon}
      </div>
      <span className="text-lg font-extrabold leading-none">{title}</span>
      <span className="mt-1 text-xs font-medium text-[#2b3234]/75">{subtitle}</span>
    </Link>
  );
}
