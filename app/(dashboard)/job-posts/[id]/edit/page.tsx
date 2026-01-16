"use client";

import { useMemo, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { Button, Spinner } from "@/components/ui";

import { DarkCard, DarkInput, DarkSelect, DarkTextarea, DashboardLayout } from "@/components/common";

import { useGetJobDetail, useUpdateJob } from "@/src/jobs/jobs";
import { JobCategory } from "@/src/model";

const CATEGORY_OPTIONS = [
  { value: JobCategory.단편영화, label: "단편영화" },
  { value: JobCategory.장편영화, label: "장편영화" },
  { value: JobCategory.웹드라마, label: "웹드라마" },
  { value: JobCategory.광고, label: "광고" },
  { value: JobCategory.뮤직비디오, label: "뮤직비디오" },
  { value: JobCategory.기타, label: "기타" },
];

const GENDER_OPTIONS = [
  { value: "남자", label: "남자" },
  { value: "여자", label: "여자" },
  { value: "성별무관", label: "성별무관" },
];

const AGE_RANGE_OPTIONS = [
  { value: "10대", label: "10대" },
  { value: "20대", label: "20대" },
  { value: "30대", label: "30대" },
  { value: "40대", label: "40대" },
  { value: "50대", label: "50대" },
  { value: "60대 이상", label: "60대 이상" },
  { value: "나이무관", label: "나이무관" },
];

interface FormData {
  category: string;
  title: string;
  description: string;
  gender: string;
  ageRange: string;
  production: string;
  workTitle: string;
  shootingDate: string;
  shootingLocation: string;
  isPumasi: boolean;
  price: string;
  contactEmail: string;
  contactPhone: string;
}

const getInitialFormData = (): FormData => ({
  category: "",
  title: "",
  description: "",
  gender: "",
  ageRange: "",
  production: "",
  workTitle: "",
  shootingDate: "",
  shootingLocation: "",
  isPumasi: false,
  price: "",
  contactEmail: "",
  contactPhone: "",
});

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const { data: jobData, isLoading } = useGetJobDetail(jobId);
  const { mutate: updateJob, isPending } = useUpdateJob();

  const initialFormData = useMemo(() => {
    if (!jobData?.data) return getInitialFormData();
    const job = jobData.data;
    return {
      category: job.category || "",
      title: job.title || "",
      description: job.description || "",
      gender: job.gender || "",
      ageRange: job.ageRange || "",
      production: job.production || "",
      workTitle: job.workTitle || "",
      shootingDate: job.shootingDate || "",
      shootingLocation: job.shootingLocation || "",
      isPumasi: job.isPumasi || false,
      price: job.price?.toString() || "",
      contactEmail: job.contactEmail || "",
      contactPhone: job.contactPhone || "",
    };
  }, [jobData]);

  const [formData, setFormData] = useState<FormData>(getInitialFormData());
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  if (jobData?.data && !isFormInitialized) {
    setFormData(initialFormData);
    setIsFormInitialized(true);
  }

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.category) newErrors.category = "카테고리를 선택해주세요";
    if (!formData.title.trim()) newErrors.title = "제목을 입력해주세요";
    if (formData.title.length > 200) newErrors.title = "제목은 200자 이내여야 합니다";
    if (!formData.gender) newErrors.gender = "성별을 선택해주세요";
    if (!formData.production.trim()) newErrors.production = "제작사를 입력해주세요";
    if (!formData.workTitle.trim()) newErrors.workTitle = "작품 제목을 입력해주세요";
    if (formData.description.length > 2000) newErrors.description = "설명은 2000자 이내여야 합니다";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    updateJob(
      {
        jobId,
        data: {
          category: formData.category as JobCategory,
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          gender: formData.gender as "남자" | "여자" | "성별무관",
          ageRange: formData.ageRange || undefined,
          production: formData.production.trim(),
          workTitle: formData.workTitle.trim(),
          shootingDate: formData.shootingDate || undefined,
          shootingLocation: formData.shootingLocation || undefined,
          isPumasi: formData.isPumasi,
          price: formData.isPumasi ? undefined : formData.price ? parseInt(formData.price, 10) : undefined,
          contactEmail: formData.contactEmail || undefined,
          contactPhone: formData.contactPhone || undefined,
        },
      },
      {
        onSuccess: () => {
          router.push(`/job-posts/${jobId}`);
        },
        onError: (error) => {
          console.error("구인글 수정 실패:", error);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <Spinner size="md" />
        </div>
      </DashboardLayout>
    );
  }

  if (!jobData?.data) {
    return (
      <DashboardLayout>
        <div className="py-16 text-center">
          <h2 className="text-ivory mb-2 text-xl font-semibold">구인글을 찾을 수 없습니다</h2>
          <Button variant="gold" onClick={() => router.push("/job-posts")}>
            목록으로 돌아가기
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const isFormValid =
    formData.category &&
    formData.title.trim() &&
    formData.gender &&
    formData.production.trim() &&
    formData.workTitle.trim();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-ivory text-2xl font-bold">구인글 수정</h1>
          <p className="text-muted-gray mt-1">구인글 정보를 수정하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <DarkCard>
            <h2 className="text-ivory mb-6 text-lg font-semibold">작품 정보</h2>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <DarkSelect
                  label="카테고리 *"
                  placeholder="카테고리 선택"
                  options={CATEGORY_OPTIONS}
                  value={formData.category}
                  onChange={(value) => updateField("category", value)}
                  error={errors.category}
                />
                <DarkSelect
                  label="성별 *"
                  placeholder="성별 선택"
                  options={GENDER_OPTIONS}
                  value={formData.gender}
                  onChange={(value) => updateField("gender", value)}
                  error={errors.gender}
                />
              </div>

              <DarkInput
                label="구인글 제목 *"
                placeholder="예: [단편영화] 20대 여성 주연 배우 모집"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                error={errors.title}
              />

              <div className="grid grid-cols-2 gap-4">
                <DarkInput
                  label="제작사/제작팀 *"
                  placeholder="제작사명"
                  value={formData.production}
                  onChange={(e) => updateField("production", e.target.value)}
                  error={errors.production}
                />
                <DarkInput
                  label="작품 제목 *"
                  placeholder="작품 제목"
                  value={formData.workTitle}
                  onChange={(e) => updateField("workTitle", e.target.value)}
                  error={errors.workTitle}
                />
              </div>

              <DarkSelect
                label="모집 나이대"
                placeholder="나이대 선택"
                options={AGE_RANGE_OPTIONS}
                value={formData.ageRange}
                onChange={(value) => updateField("ageRange", value)}
              />

              <DarkTextarea
                label="상세 설명"
                placeholder="역할, 캐릭터 설명, 필요 조건 등을 상세히 작성해주세요"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={5}
                error={errors.description}
                hint={`${formData.description.length}/2000자`}
              />
            </div>
          </DarkCard>

          <DarkCard>
            <h2 className="text-ivory mb-6 text-lg font-semibold">촬영 정보</h2>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <DarkInput
                  label="촬영 예정일"
                  placeholder="예: 2024년 3월 중"
                  value={formData.shootingDate}
                  onChange={(e) => updateField("shootingDate", e.target.value)}
                />
                <DarkInput
                  label="촬영 장소"
                  placeholder="예: 서울 마포구"
                  value={formData.shootingLocation}
                  onChange={(e) => updateField("shootingLocation", e.target.value)}
                />
              </div>
            </div>
          </DarkCard>

          <DarkCard>
            <h2 className="text-ivory mb-6 text-lg font-semibold">출연료</h2>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPumasi"
                  checked={formData.isPumasi}
                  onChange={(e) => updateField("isPumasi", e.target.checked)}
                  className="bg-luxury-secondary border-border text-gold focus:ring-gold h-5 w-5 rounded"
                />
                <label htmlFor="isPumasi" className="text-ivory cursor-pointer">
                  품앗이 (무보수)
                </label>
              </div>

              {!formData.isPumasi && (
                <DarkInput
                  label="출연료"
                  type="number"
                  placeholder="출연료 (원)"
                  value={formData.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  hint="숫자만 입력해주세요"
                />
              )}
            </div>
          </DarkCard>

          <DarkCard>
            <h2 className="text-ivory mb-6 text-lg font-semibold">연락처</h2>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <DarkInput
                  label="이메일"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.contactEmail}
                  onChange={(e) => updateField("contactEmail", e.target.value)}
                />
                <DarkInput
                  label="연락처"
                  type="tel"
                  placeholder="010-0000-0000"
                  value={formData.contactPhone}
                  onChange={(e) => updateField("contactPhone", e.target.value)}
                />
              </div>
            </div>
          </DarkCard>

          <div className="grid grid-cols-2 gap-4">
            <Button type="button" variant="gold-secondary" fullWidth onClick={() => router.back()}>
              취소
            </Button>
            <Button type="submit" variant="gold" fullWidth disabled={!isFormValid} loading={isPending}>
              수정 완료
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
