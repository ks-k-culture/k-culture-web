"use client";

import { Spinner } from "@/components/ui";

import { DashboardLayout } from "@/components/common";

import { useGetMyProfile } from "@/src/users/users";

import { ActorDashboard, AgencyDashboard } from "./_components";

type UserType = "actor" | "agency";

export default function DashboardPage() {
  const { data: response, isLoading } = useGetMyProfile();
  const userType: UserType = (response?.data?.type as UserType) ?? "actor";

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const Dashboard = userType === "actor" ? ActorDashboard : AgencyDashboard;

  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}
