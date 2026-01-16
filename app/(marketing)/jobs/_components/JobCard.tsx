"use client";

import { memo } from "react";

import Link from "next/link";

import { Badge, Card } from "@/components/ui";

import { getJobCategoryStyle } from "@/lib/constants/styles";
import { cn } from "@/lib/utils";

import type { JobSummary } from "@/src/model";
import { JobStatus } from "@/src/model";

interface JobCardProps {
  job: JobSummary;
}

export const JobCard = memo(function JobCard({ job }: JobCardProps) {
  const isRecruiting = job.status === JobStatus.모집중;

  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="bg-luxury-black/80 hover:border-gold/50 group cursor-pointer transition-all">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-3">
                <Badge variant="outline" className={cn("font-medium", getJobCategoryStyle(job.category))}>
                  {job.category}
                </Badge>
                {job.isPumasi ? (
                  <span className="text-gold flex items-center gap-1 text-sm">💜 품앗이</span>
                ) : job.price ? (
                  <span className="flex items-center gap-1 text-sm text-yellow-400">
                    💰 {job.price.toLocaleString()}원
                  </span>
                ) : null}
              </div>

              <h3 className="group-hover:text-gold mb-3 line-clamp-2 text-lg font-medium text-white transition-colors">
                {job.title}
              </h3>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-luxury-secondary text-warm-gray">
                  {job.gender}
                </Badge>
                <Badge variant="secondary" className="bg-luxury-secondary text-muted-gray">
                  제작: {job.production}
                </Badge>
                <Badge variant="secondary" className="bg-luxury-secondary text-muted-gray">
                  작품: {job.workTitle}
                </Badge>
              </div>
            </div>

            <div className="text-right">
              <p className={cn("mb-1 font-medium", isRecruiting ? "text-green-400" : "text-muted-gray")}>
                {job.status}
              </p>
              <p className="text-muted-gray text-sm">조회 {job.views?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
});
