"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui";

import { DarkCard, DarkInput, DarkSelect, DarkTextarea, DashboardLayout } from "@/components/common";

const PROJECT_TYPES = [
  { value: "영화", label: "영화" },
  { value: "드라마", label: "드라마" },
  { value: "웹드라마", label: "웹드라마" },
  { value: "OTT 시리즈", label: "OTT 시리즈" },
  { value: "뮤직비디오", label: "뮤직비디오" },
  { value: "광고", label: "광고" },
  { value: "기타", label: "기타" },
];

const GENRES = [
  { value: "액션", label: "액션" },
  { value: "로맨스", label: "로맨스" },
  { value: "코미디", label: "코미디" },
  { value: "드라마", label: "드라마" },
  { value: "스릴러", label: "스릴러" },
  { value: "공포", label: "공포" },
  { value: "SF", label: "SF" },
  { value: "판타지", label: "판타지" },
  { value: "사극", label: "사극" },
  { value: "기타", label: "기타" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [company, setCompany] = useState("");
  const [projectType, setProjectType] = useState("");
  const [genre, setGenre] = useState("");
  const [shootingPeriod, setShootingPeriod] = useState("");
  const [roleInfo, setRoleInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = projectName && company && projectType && genre;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    try {
      // TODO: API 연동
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/projects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-ivory text-2xl font-bold">새 프로젝트</h1>
          <p className="text-muted-gray mt-1">프로젝트 정보를 입력하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <DarkCard>
            <h2 className="text-ivory mb-6 text-lg font-semibold">기본 정보</h2>
            <div className="space-y-5">
              <DarkInput
                label="프로젝트명"
                placeholder="프로젝트명을 입력하세요"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />

              <DarkInput
                label="제작사"
                placeholder="제작사명을 입력하세요"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <DarkSelect
                  label="작품 유형"
                  placeholder="유형 선택"
                  options={PROJECT_TYPES}
                  value={projectType}
                  onChange={setProjectType}
                />

                <DarkSelect label="장르" placeholder="장르 선택" options={GENRES} value={genre} onChange={setGenre} />
              </div>

              <DarkInput
                label="촬영 기간"
                placeholder="예: 2024.03 ~ 2024.06"
                value={shootingPeriod}
                onChange={(e) => setShootingPeriod(e.target.value)}
              />
            </div>
          </DarkCard>

          <DarkCard>
            <h2 className="text-ivory mb-6 text-lg font-semibold">배역 정보</h2>
            <DarkTextarea
              label="배역 상세"
              placeholder="캐스팅하려는 배역에 대한 상세 정보를 입력하세요"
              value={roleInfo}
              onChange={(e) => setRoleInfo(e.target.value)}
              rows={5}
              hint="프로젝트 생성 후 개별 캐릭터를 추가할 수 있습니다"
            />
          </DarkCard>

          <div className="flex gap-3">
            <Button type="button" variant="gold-secondary" fullWidth onClick={() => router.back()}>
              취소
            </Button>
            <Button type="submit" variant="gold" fullWidth disabled={!isValid} loading={loading}>
              프로젝트 생성
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
