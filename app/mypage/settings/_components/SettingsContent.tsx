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
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon } from "./Icons";

function ToggleSwitch({ enabled, onToggle, disabled }: { enabled: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
        enabled ? "bg-[#E50815]" : "bg-[#E5E8EB]"
      }`}
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
    <section className="px-5 py-6 border-b animate-pulse" style={{ borderColor: "#E5E8EB" }}>
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
    <section className="border-b animate-pulse" style={{ borderColor: "#F2F4F6" }}>
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
      setCastingNotification(notifications.castingOffers ?? false);
      setMessageNotification(notifications.messages ?? false);
      setMarketingNotification(notifications.marketing ?? false);
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
        castingOffers: newCasting,
        messages: newMessage,
        marketing: newMarketing,
      },
    });
  };

  const getInitial = (name?: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 bg-white">
          <div className="flex items-center gap-3 px-4 py-4">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2">
              <ChevronLeftIcon className="w-6 h-6" style={{ color: "#191F28" }} />
            </button>
            <h1 className="text-lg font-semibold" style={{ color: "#191F28" }}>
              설정 페이지
            </h1>
          </div>
        </header>

        <main className="flex-1">
          {isProfileLoading ? (
            <ProfileSkeleton />
          ) : (
            <section className="px-5 py-6 border-b" style={{ borderColor: "#E5E8EB" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                      style={{ backgroundColor: "rgba(78, 89, 104, 0.1)", color: "#4E5968" }}
                    >
                      프로필 설정
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-1" style={{ color: "#191F28" }}>
                    {profile?.name ?? "사용자 이름"}
                  </h2>
                  <p className="text-sm" style={{ color: "#4E5968" }}>
                    {profile?.email ?? "user@email.com"}
                  </p>
                </div>

                <div className="relative">
                  <div
                    className="w-[100px] h-[100px] rounded-full overflow-hidden flex items-center justify-center"
                    style={{ backgroundColor: "#8B95A1" }}
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
                    style={{ borderColor: "#E5E8EB" }}
                  >
                    <PencilIcon className="w-5 h-5" style={{ color: "#8B95A1" }} />
                  </Link>
                </div>
              </div>
            </section>
          )}

          {isNotificationLoading ? (
            <NotificationSkeleton />
          ) : (
            <section className="border-b" style={{ borderColor: "#F2F4F6" }}>
              <div className="px-5 py-4">
                <h3 className="text-sm font-medium mb-4" style={{ color: "#4E5968" }}>
                  알림 설정
                </h3>

                <div className="flex items-center justify-between py-3">
                  <span className="text-base" style={{ color: "#4E5968" }}>
                    새로운 캐스팅 제안
                  </span>
                  <ToggleSwitch
                    enabled={castingNotification}
                    onToggle={() => handleNotificationToggle("casting")}
                    disabled={isUpdating}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-base" style={{ color: "#4E5968" }}>
                    메시지 알림
                  </span>
                  <ToggleSwitch
                    enabled={messageNotification}
                    onToggle={() => handleNotificationToggle("message")}
                    disabled={isUpdating}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-base" style={{ color: "#4E5968" }}>
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

          <section className="border-b" style={{ borderColor: "#F2F4F6" }}>
            <div className="px-5 py-4">
              <h3 className="text-sm font-medium mb-4" style={{ color: "#4E5968" }}>
                계정 관리
              </h3>

              <button className="flex items-center justify-between w-full py-3">
                <span className="text-base" style={{ color: "#4E5968" }}>
                  로그아웃
                </span>
                <ChevronRightIcon className="w-5 h-5" style={{ color: "#8B95A1" }} />
              </button>

              <button className="flex items-center justify-between w-full py-3">
                <span className="text-base" style={{ color: "#4E5968" }}>
                  계정 삭제
                </span>
                <ChevronRightIcon className="w-5 h-5" style={{ color: "#8B95A1" }} />
              </button>

              <div className="flex items-center justify-between py-3">
                <span className="text-base" style={{ color: "#4E5968" }}>
                  앱 정보
                </span>
                <span className="text-sm" style={{ color: "#8B95A1" }}>
                  v1.0.2
                </span>
              </div>
            </div>
          </section>

          <section className="border-b" style={{ borderColor: "#F2F4F6" }}>
            <div className="px-5 py-4">
              <button className="flex items-center justify-between w-full py-3">
                <span className="text-base" style={{ color: "#4E5968" }}>
                  이용약관 및 개인정보 처리방침
                </span>
                <ChevronRightIcon className="w-5 h-5" style={{ color: "#8B95A1" }} />
              </button>
            </div>
          </section>

          <section className="px-5 py-8 flex flex-col items-center">
            <p className="text-sm font-medium mb-2" style={{ color: "#E50815" }}>
              궁금한 점이 있으신가요?
            </p>
            <p className="text-sm" style={{ color: "#8B95A1" }}>
              고객센터 문의하기
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
