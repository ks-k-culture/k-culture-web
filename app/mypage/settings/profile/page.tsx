"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function ChevronLeftIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}

function ChevronDownIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function PencilIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  );
}

function XCircleIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const positionOptions = ["배우", "모델", "가수", "MC", "기타"];

const feeOptions = ["협의", "100만원 이하", "100~300만원", "300~500만원", "500만원 이상"];

export default function ProfileEditPage() {
  const router = useRouter();

  const [name, setName] = useState("홍길동");
  const [position, setPosition] = useState("배우");
  const [agency, setAgency] = useState("소속사 없음");
  const [email, setEmail] = useState("user@email.com");
  const [phone, setPhone] = useState("010-1234-5678");
  const [bio, setBio] = useState("");
  const [fee, setFee] = useState("협의");
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("65");

  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isFeeOpen, setIsFeeOpen] = useState(false);
  const [isBioOpen, setIsBioOpen] = useState(false);
  const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(true);

  const handleSave = () => {
    console.log("프로필 저장:", {
      name,
      position,
      agency,
      email,
      phone,
      bio,
      fee,
      height,
      weight,
    });
    router.back();
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
              프로필 변집 페이지
            </h1>
          </div>
        </header>

        <main className="flex-1 pb-32">
          <section className="px-5 py-6">
            <div className="relative w-[100px] h-[100px]">
              <div
                className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: "#8B95A1" }}
              >
                <span className="text-white text-3xl font-bold">홍</span>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력해주세요"
              className="w-full px-4 py-3 rounded-xl border text-base outline-none"
              style={{ borderColor: "#E5E8EB", color: "#191F28" }}
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
            <button onClick={() => setIsBioOpen(!isBioOpen)} className="w-full flex items-center justify-between py-2">
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

        <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-6 max-w-lg mx-auto">
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-xl font-medium text-white"
            style={{ backgroundColor: "#191F28" }}
          >
            프로필 업데이트
          </button>
        </div>
      </div>
    </div>
  );
}
