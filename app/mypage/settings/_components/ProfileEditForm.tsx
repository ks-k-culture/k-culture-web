"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGetMyProfile, useUpdateMyProfile, getGetMyProfileQueryKey } from "@/src/users/users";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronDownIcon, PencilIcon, XCircleIcon } from "./Icons";

const positionOptions = ["배우", "모델", "가수", "MC", "기타"];
const feeOptions = ["협의", "100만원 이하", "100~300만원", "300~500만원", "500만원 이상"];

function FormSkeleton() {
  return (
    <main className="flex-1 pb-32 animate-pulse">
      <section className="px-5 py-6">
        <div className="w-[100px] h-[100px] rounded-full bg-gray-200" />
      </section>
      {[1, 2, 3, 4, 5].map((i) => (
        <section key={i} className="px-5 py-4">
          <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
          <div className="h-12 bg-gray-200 rounded-xl" />
        </section>
      ))}
    </main>
  );
}

export function ProfileEditForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: profileData, isLoading } = useGetMyProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateMyProfile({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
        router.back();
      },
    },
  });

  const profile = profileData?.data;

  const [name, setName] = useState("");
  const [position, setPosition] = useState("배우");
  const [agency, setAgency] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [fee, setFee] = useState("협의");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isFeeOpen, setIsFeeOpen] = useState(false);
  const [isBioOpen, setIsBioOpen] = useState(false);
  const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(true);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setPosition(profile.position ?? "배우");
      setAgency(profile.agency ?? "");
      setPhone(profile.phone ?? "");
      setBio(profile.bio ?? "");
      setFee(profile.fee ?? "협의");
      setHeight(profile.height?.toString() ?? "");
      setWeight(profile.weight?.toString() ?? "");
    }
  }, [profile]);

  const handleSave = () => {
    updateProfile({
      data: {
        name,
        position,
        agency,
        phone,
        bio,
        fee,
        height: height ? Number(height) : undefined,
        weight: weight ? Number(weight) : undefined,
      },
    });
  };

  const getInitial = (inputName?: string) => {
    if (!inputName) return "U";
    return inputName.charAt(0).toUpperCase();
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
              프로필 편집 페이지
            </h1>
          </div>
        </header>

        {isLoading ? (
          <FormSkeleton />
        ) : (
          <main className="flex-1 pb-32">
            <section className="px-5 py-6">
              <div className="relative w-[100px] h-[100px]">
                <div
                  className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
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
                    <span className="text-white text-3xl font-bold">{getInitial(name || profile?.name)}</span>
                  )}
                </div>
                <button
                  className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-white border flex items-center justify-center"
                  style={{ borderColor: "#E5E8EB" }}
                >
                  <PencilIcon className="w-5 h-5" style={{ color: "#8B95A1" }} />
                </button>
              </div>
            </section>

            <section className="px-5 py-4">
              <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
                이름 및 닉네임
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력해주세요"
                  className="w-full px-4 py-3 rounded-xl border text-base outline-none"
                  style={{ borderColor: "#E5E8EB", color: "#191F28" }}
                />
                {name && (
                  <button onClick={() => setName("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <XCircleIcon className="w-5 h-5" style={{ color: "#B0B8C1" }} />
                  </button>
                )}
              </div>
            </section>

            <section className="px-5 py-4 border-b" style={{ borderColor: "#E5E8EB" }}>
              <div className="relative">
                <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
                  포지션
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsPositionOpen(!isPositionOpen);
                    setIsFeeOpen(false);
                  }}
                  className="w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between text-base"
                  style={{ borderColor: "#E5E8EB", color: "#191F28" }}
                >
                  {position}
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform ${isPositionOpen ? "rotate-180" : ""}`}
                    style={{ color: "#6B7684" }}
                  />
                </button>
                {isPositionOpen && (
                  <div
                    className="absolute z-10 w-full bg-white border rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto"
                    style={{ borderColor: "#E5E8EB" }}
                  >
                    {positionOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setPosition(option);
                          setIsPositionOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-base hover:bg-[#F2F4F6]"
                        style={{ color: "#191F28" }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="px-5 py-4">
              <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
                소속사
              </label>
              <input
                type="text"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                placeholder="소속사를 입력해주세요"
                className="w-full px-4 py-3 rounded-xl border text-base outline-none"
                style={{ borderColor: "#E5E8EB", color: "#191F28" }}
              />
            </section>

            <section className="px-5 py-4">
              <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
                이메일
              </label>
              <input
                type="email"
                value={profile?.email ?? ""}
                disabled
                className="w-full px-4 py-3 rounded-xl border text-base outline-none bg-gray-50"
                style={{ borderColor: "#E5E8EB", color: "#8B95A1" }}
              />
            </section>

            <section className="px-5 py-4">
              <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
                연락처
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="연락처를 입력해주세요"
                className="w-full px-4 py-3 rounded-xl border text-base outline-none"
                style={{ borderColor: "#E5E8EB", color: "#191F28" }}
              />
            </section>

            <section className="px-5 py-4 border-b" style={{ borderColor: "#E5E8EB" }}>
              <button
                onClick={() => setIsBioOpen(!isBioOpen)}
                className="w-full flex items-center justify-between py-2"
              >
                <span className="text-sm font-medium" style={{ color: "#4E5968" }}>
                  자기소개
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform ${isBioOpen ? "rotate-180" : ""}`}
                  style={{ color: "#6B7684" }}
                />
              </button>
              {isBioOpen && (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="자기소개를 입력해주세요"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border text-base outline-none resize-none mt-2"
                  style={{ borderColor: "#E5E8EB", color: "#191F28" }}
                />
              )}
            </section>

            <section className="px-5 py-4">
              <div className="rounded-xl border p-4" style={{ borderColor: "#E5E8EB" }}>
                <button
                  onClick={() => setIsBasicInfoOpen(!isBasicInfoOpen)}
                  className="w-full flex items-center justify-between"
                >
                  <span className="text-base font-semibold" style={{ color: "#191F28" }}>
                    기본 인적사항
                  </span>
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform ${isBasicInfoOpen ? "rotate-180" : ""}`}
                    style={{ color: "#6B7684" }}
                  />
                </button>

                {isBasicInfoOpen && (
                  <div className="mt-4 space-y-4">
                    <div className="relative">
                      <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
                        출연료
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsFeeOpen(!isFeeOpen);
                          setIsPositionOpen(false);
                        }}
                        className="w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between text-base"
                        style={{ borderColor: "#E5E8EB", color: "#191F28" }}
                      >
                        {fee}
                        <ChevronDownIcon
                          className={`w-5 h-5 transition-transform ${isFeeOpen ? "rotate-180" : ""}`}
                          style={{ color: "#6B7684" }}
                        />
                      </button>
                      {isFeeOpen && (
                        <div
                          className="absolute z-10 w-full bg-white border rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto"
                          style={{ borderColor: "#E5E8EB" }}
                        >
                          {feeOptions.map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setFee(option);
                                setIsFeeOpen(false);
                              }}
                              className="block w-full text-left px-4 py-3 text-base hover:bg-[#F2F4F6]"
                              style={{ color: "#191F28" }}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
                        키 (cm)
                      </label>
                      <input
                        type="text"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="키를 입력해주세요"
                        className="w-full px-4 py-3 rounded-xl border text-base outline-none"
                        style={{ borderColor: "#E5E8EB", color: "#191F28" }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
                        몸무게 (kg)
                      </label>
                      <input
                        type="text"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="몸무게를 입력해주세요"
                        className="w-full px-4 py-3 rounded-xl border text-base outline-none"
                        style={{ borderColor: "#E5E8EB", color: "#191F28" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>
          </main>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-6 max-w-lg mx-auto">
          <button
            onClick={handleSave}
            disabled={isUpdating || isLoading}
            className="w-full py-4 rounded-xl font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: "#191F28" }}
          >
            {isUpdating ? "저장중..." : "프로필 업데이트"}
          </button>
        </div>
      </div>
    </div>
  );
}
