import { SPINNER } from "@/lib/constants/styles";

import { DashboardLayout } from "./DashboardLayout";

interface DashboardLoadingStateProps {
  height?: string;
}

export function DashboardLoadingState({ height = "h-64" }: DashboardLoadingStateProps) {
  return (
    <DashboardLayout>
      <div className={`flex items-center justify-center ${height}`}>
        <div className={SPINNER.MEDIUM} />
      </div>
    </DashboardLayout>
  );
}
