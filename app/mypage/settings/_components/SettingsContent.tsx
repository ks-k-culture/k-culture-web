"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useGetMyProfile } from "@/src/users/users";
import {
  useGetNotificationSettings,
  useUpdateNotificationSettings,
  getGetNotificationSettingsQueryKey,
} from "@/src/users/users";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon } from "@/app/components/Icons";
import { PageLayout } from "@/app/components/PageLayout";
import { COLORS } from "@/lib/constants";

function ToggleSwitch({ enabled, onToggle, disabled }: { enabled: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50"
      style={{ backgroundColor: enabled ? COLORS.accent.red : COLORS.border.default }}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

function ProfileSkeleton() {
  return (
    <section className="px-5 py-6 border-b animate-pulse" style={{ borderColor: COLORS.border.default }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="h-5 w-16 bg-gray-200 rounded mb-2" />
          <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-40 bg-gray-200 rounded" />
        </div>
        <div className="w-[100px] h-[100px] rounded-full bg-gray-200" />
      </div>
    </section>
  );
}

function NotificationSkeleton() {
  return (
    <section className="border-b animate-pulse" style={{ borderColor: COLORS.border.light }}>
      <div className="px-5 py-4">
        <div className="h-4 w-16 bg-gray-200 rounded mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="h-5 w-32 bg-gray-200 rounded" />
            <div className="h-6 w-11 bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function SettingsContent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: profileData, isLoading: isProfileLoading } = useGetMyProfile();
  const { data: notificationData, isLoading: isNotificationLoading } = useGetNotificationSettings();

  const { mutate: updateNotificationSettings, isPending: isUpdating } = useUpdateNotificationSettings({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetNotificationSettingsQueryKey() });
      },
    },
  });

  const profile = profileData?.data;
  const notifications = notificationData?.data;

  const [castingNotification, setCastingNotification] = useState(false);
  const [messageNotification, setMessageNotification] = useState(false);
  const [marketingNotification, setMarketingNotification] = useState(false);

  useEffect(() => {
    if (notifications) {
      setCastingNotification(notifications.castingNotification ?? false);
      setMessageNotification(notifications.messageNotification ?? false);
      setMarketingNotification(notifications.marketingNotification ?? false);
    }
  }, [notifications]);

  const handleNotificationToggle = (type: "casting" | "message" | "marketing") => {
    const newCasting = type === "casting" ? !castingNotification : castingNotification;
    const newMessage = type === "message" ? !messageNotification : messageNotification;
    const newMarketing = type === "marketing" ? !marketingNotification : marketingNotification;

    if (type === "casting") setCastingNotification(newCasting);
    if (type === "message") setMessageNotification(newMessage);
    if (type === "marketing") setMarketingNotification(newMarketing);

    updateNotificationSettings({
      data: {
        castingNotification: newCasting,
        messageNotification: newMessage,
        marketingNotification: newMarketing,
      },
    });
  };

  const getInitial = (name?: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <PageLayout>
      <header className="sticky top-0 z-20 bg-white">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2">
            <ChevronLeftIcon className="w-6 h-6" style={{ color: COLORS.text.primary }} />
          </button>
          <h1 className="text-lg font-semibold" style={{ color: COLORS.text.primary }}>
            설정 페이지
          </h1>
        </div>
      </header>

      <main className="flex-1">
        {isProfileLoading ? (
          <ProfileSkeleton />
        ) : (
          <section className="px-5 py-6 border-b" style={{ borderColor: COLORS.border.default }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                    style={{ backgroundColor: COLORS.status.planning.bg, color: COLORS.status.planning.text }}
                  >
                    프로필 설정
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-1" style={{ color: COLORS.text.primary }}>
                  {profile?.name ?? "사용자 이름"}
                </h2>
                <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                  {profile?.email ?? "user@email.com"}
                </p>
              </div>

              <div className="relative">
                <div
                  className="w-[100px] h-[100px] rounded-full overflow-hidden flex items-center justify-center"
                  style={{ backgroundColor: COLORS.text.muted }}
                >
                  {profile?.profileImage ? (
                    <Image
                      src={profile.profileImage}
                      alt={profile.name ?? "프로필"}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-3xl font-bold">{getInitial(profile?.name)}</span>
                  )}
                </div>
                <Link
                  href="/mypage/settings/profile"
                  className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-white border flex items-center justify-center"
                  style={{ borderColor: COLORS.border.default }}
                >
                  <PencilIcon className="w-5 h-5" style={{ color: COLORS.text.muted }} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {isNotificationLoading ? (
          <NotificationSkeleton />
        ) : (
          <section className="border-b" style={{ borderColor: COLORS.border.light }}>
            <div className="px-5 py-4">
              <h3 className="text-sm font-medium mb-4" style={{ color: COLORS.text.secondary }}>
                알림 설정
              </h3>

              <div className="flex items-center justify-between py-3">
                <span className="text-base" style={{ color: COLORS.text.secondary }}>
                  새로운 캐스팅 제안
                </span>
                <ToggleSwitch
                  enabled={castingNotification}
                  onToggle={() => handleNotificationToggle("casting")}
                  disabled={isUpdating}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-base" style={{ color: COLORS.text.secondary }}>
                  메시지 알림
                </span>
                <ToggleSwitch
                  enabled={messageNotification}
                  onToggle={() => handleNotificationToggle("message")}
                  disabled={isUpdating}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-base" style={{ color: COLORS.text.secondary }}>
                  마케팅 알림
                </span>
                <ToggleSwitch
                  enabled={marketingNotification}
                  onToggle={() => handleNotificationToggle("marketing")}
                  disabled={isUpdating}
                />
              </div>
            </div>
          </section>
        )}

        <section className="border-b" style={{ borderColor: COLORS.border.light }}>
          <div className="px-5 py-4">
            <h3 className="text-sm font-medium mb-4" style={{ color: COLORS.text.secondary }}>
              계정 관리
            </h3>

            <button className="flex items-center justify-between w-full py-3">
              <span className="text-base" style={{ color: COLORS.text.secondary }}>
                로그아웃
              </span>
              <ChevronRightIcon className="w-5 h-5" style={{ color: COLORS.text.muted }} />
            </button>

            <button className="flex items-center justify-between w-full py-3">
              <span className="text-base" style={{ color: COLORS.text.secondary }}>
                계정 삭제
              </span>
              <ChevronRightIcon className="w-5 h-5" style={{ color: COLORS.text.muted }} />
            </button>

            <div className="flex items-center justify-between py-3">
              <span className="text-base" style={{ color: COLORS.text.secondary }}>
                앱 정보
              </span>
              <span className="text-sm" style={{ color: COLORS.text.muted }}>
                v1.0.2
              </span>
            </div>
          </div>
        </section>

        <section className="border-b" style={{ borderColor: COLORS.border.light }}>
          <div className="px-5 py-4">
            <button className="flex items-center justify-between w-full py-3">
              <span className="text-base" style={{ color: COLORS.text.secondary }}>
                이용약관 및 개인정보 처리방침
              </span>
              <ChevronRightIcon className="w-5 h-5" style={{ color: COLORS.text.muted }} />
            </button>
          </div>
        </section>

        <section className="px-5 py-8 flex flex-col items-center">
          <p className="text-sm font-medium mb-2" style={{ color: COLORS.accent.red }}>
            궁금한 점이 있으신가요?
          </p>
          <p className="text-sm" style={{ color: COLORS.text.muted }}>
            고객센터 문의하기
          </p>
        </section>
      </main>
    </PageLayout>
  );
}
