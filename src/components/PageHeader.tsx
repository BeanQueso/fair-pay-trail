import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">{eyebrow}</p>
        )}
        <h1 className="text-3xl leading-tight text-foreground sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {action}
    </header>
  );
}
