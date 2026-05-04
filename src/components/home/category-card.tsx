import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  href: string;
  icon?: React.ReactNode;
  category: "stay" | "experience" | "program" | "course";
  description?: string;
}

export function CategoryCard({ title, href, icon, category, description }: CategoryCardProps) {
  const categoryStyles = {
    stay: "bg-category-stay/10 text-category-stay border-category-stay/20 hover:bg-category-stay/20",
    experience: "bg-category-experience/10 text-category-experience border-category-experience/20 hover:bg-category-experience/20",
    program: "bg-category-program/10 text-category-program border-category-program/20 hover:bg-category-program/20",
    course: "bg-category-course/10 text-category-course border-category-course/20 hover:bg-category-course/20",
  };

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center p-6 border rounded-xl transition-colors text-center gap-2 h-full",
        categoryStyles[category]
      )}
    >
      {icon && <div className="mb-1">{icon}</div>}
      <span className="font-bold text-lg">{title}</span>
      {description && <span className="text-[10px] opacity-80 leading-tight">{description}</span>}
    </Link>
  );
}
