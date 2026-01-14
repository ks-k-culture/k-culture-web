import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { DarkCard } from "../Card/DarkCard";

export interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <DarkCard className={cn("py-16 text-center", className)}>
      {icon && (
        <div className="bg-gold/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">{icon}</div>
      )}
      {title && <h3 className="text-ivory mb-2 text-lg font-semibold">{title}</h3>}
      <p className="text-muted-gray mb-4">{description}</p>
      {action}
    </DarkCard>
  );
}
