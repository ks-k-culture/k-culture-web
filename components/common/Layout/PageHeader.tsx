import type { ReactNode } from "react";

import Link from "next/link";

import { Button } from "@/components/ui";

import { ChevronLeftIcon } from "../Misc/Icons";

export interface PageHeaderProps {
  title: string;
  backHref?: string;
  action?: ReactNode;
  description?: string;
}

export function PageHeader({ title, backHref, action, description }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {backHref && (
            <Link href={backHref}>
              <Button variant="ghost" size="sm" className="text-muted-gray hover:text-ivory">
                <ChevronLeftIcon className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <h1 className="text-heading-xl text-ivory">{title}</h1>
        </div>
        {action}
      </div>
      {description && <p className="text-muted-gray text-sm">{description}</p>}
    </div>
  );
}
