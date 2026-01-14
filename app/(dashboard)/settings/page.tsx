"use client";

import { useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { ConfirmDialog, Spinner } from "@/components/ui";

import { DashboardLayout } from "@/components/common";

import { useAuthStore } from "@/stores/useAuthStore";

import { useDeleteAccount, useLogout } from "@/src/auth/auth";
import { useGetMyProfile, useGetNotificationSettings, useUpdateNotificationSettings } from "@/src/users/users";

import { AccountInfoSection, AccountManagementSection, NotificationSettingsSection } from "./_components";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { data: profileData } = useGetMyProfile();
  const { data: settingsData, isLoading } = useGetNotificationSettings();
  const logout = useAuthStore((state) => state.logout);

  const [castingNotification, setCastingNotification] = useState(true);
  const [messageNotification, setMessageNotification] = useState(true);
  const [marketingNotification, setMarketingNotification] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const updateSettingsMutation = useUpdateNotificationSettings();
  const logoutMutation = useLogout();
  const deleteAccountMutation = useDeleteAccount();

  useEffect(() => {
    if (settingsData?.data) {
      setCastingNotification(settingsData.data.castingNotification);
      setMessageNotification(settingsData.data.messageNotification);
      setMarketingNotification(settingsData.data.marketingNotification);
    }
  }, [settingsData]);

  const handleSave = async () => {
    updateSettingsMutation.mutate(
      {
        data: {
          castingNotification,
          messageNotification,
          marketingNotification,
        },
      },
      {
        onSuccess: () => {
          toast.success("설정이 저장되었습니다");
        },
        onError: () => {
          toast.error("설정 저장에 실패했습니다");
        },
      }
    );
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        logout();
        window.location.href = "/login";
      },
      onError: () => {
        toast.error("로그아웃에 실패했습니다");
        setLogoutDialogOpen(false);
      },
    });
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        logout();
        window.location.href = "/";
      },
      onError: () => {
        toast.error("계정 삭제에 실패했습니다");
        setDeleteDialogOpen(false);
      },
    });
  };

  const userType = profileData?.data?.type || "actor";
  const userEmail = profileData?.data?.email || "user@example.com";

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <Spinner size="md" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-heading-xl text-ivory">설정</h1>
          <p className="text-muted-gray mt-1">계정 및 알림 설정을 관리하세요</p>
        </div>

        <AccountInfoSection userEmail={userEmail} userType={userType} />

        <NotificationSettingsSection
          castingNotification={castingNotification}
          messageNotification={messageNotification}
          marketingNotification={marketingNotification}
          onCastingToggle={() => setCastingNotification(!castingNotification)}
          onMessageToggle={() => setMessageNotification(!messageNotification)}
          onMarketingToggle={() => setMarketingNotification(!marketingNotification)}
          onSave={handleSave}
          isSaving={updateSettingsMutation.isPending}
        />

        <AccountManagementSection
          onLogout={() => setLogoutDialogOpen(true)}
          onDeleteAccount={() => setDeleteDialogOpen(true)}
        />
      </div>

      <ConfirmDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        title="로그아웃"
        description="정말 로그아웃 하시겠습니까?"
        confirmText="로그아웃"
        cancelText="취소"
        onConfirm={handleLogout}
        loading={logoutMutation.isPending}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="계정 삭제"
        description="정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDeleteAccount}
        variant="danger"
        loading={deleteAccountMutation.isPending}
      />
    </DashboardLayout>
  );
}
