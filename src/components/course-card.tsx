import { ExternalLink, Star, Clock } from "lucide-react";
import type { CourseCard as CourseCardT } from "@/lib/curriculum-data";

export function CourseCard({ course }: { course: CourseCardT }) {
  return (
    <a
      href={course.affiliateUrl}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-lg border border-border/60 bg-card/60 hover:bg-card hover:border-primary/40 transition-all p-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-mono text-primary/80">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {course.provider} · Affiliate
          </div>
          <div className="text-sm font-medium mt-1 leading-snug truncate">{course.title}</div>
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current text-yellow-500" />
              {course.rating}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {course.hours}h
            </span>
          </div>
        </div>
        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      </div>
    </a>
  );
}