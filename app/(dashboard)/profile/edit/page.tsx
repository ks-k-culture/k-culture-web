"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button, Spinner } from "@/components/ui";

import { DarkCard, DashboardLayout } from "@/components/common";

import { useActorProfile, useUpdateActorProfile, useUploadProfileImage } from "@/lib/hooks/use-actor-profile";

import { useGetMyProfile } from "@/src/users/users";

import { BasicInfoSection } from "./_components/BasicInfoSection";
import { ProfileImageUpload } from "./_components/ProfileImageUpload";
import { SkillsSection } from "./_components/SkillsSection";

const profileSchema = z.object({
  stageName: z.string().min(2, "활동명은 2자 이상이어야 합니다").max(50),
  birthYear: z.string().optional(),
  introduction: z.string().max(500, "소개는 500자 이하여야 합니다").optional(),
  nationality: z.string().max(50).optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  agency: z.string().max(100).optional(),
  skills: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileEditPage() {
  const router = useRouter();
  const { data: userData } = useGetMyProfile();
  const { data: actorData, isLoading, isError, error } = useActorProfile();
  const updateMutation = useUpdateActorProfile();
  const uploadImageMutation = useUploadProfileImage();

  const userType = userData?.data?.type ?? "actor";
  const actorProfile = actorData?.data;

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      stageName: "",
      birthYear: "",
      introduction: "",
      nationality: "",
      height: "",
      weight: "",
      agency: "",
      skills: [],
      languages: [],
    },
  });

  useEffect(() => {
    if (actorProfile) {
      form.reset({
        stageName: actorProfile.stageName ?? "",
        birthYear: actorProfile.birthYear?.toString() ?? "",
        introduction: actorProfile.introduction ?? "",
        nationality: actorProfile.nationality ?? "",
        height: actorProfile.height?.toString() ?? "",
        weight: actorProfile.weight?.toString() ?? "",
        agency: actorProfile.agency ?? "",
        skills: actorProfile.skills ?? [],
        languages: actorProfile.languages ?? [],
      });
    }
  }, [actorProfile, form]);

  useEffect(() => {
    if (isError && error) {
      const statusCode = (error as Error & { status?: number }).status;
      if (statusCode === 404 || statusCode === 500) {
        toast.info("프로필을 먼저 등록해주세요");
        router.push("/onboarding/actor/step1?new=true");
      }
    }
  }, [isError, error, router]);

  const onSubmit = form.handleSubmit((data) => {
    updateMutation.mutate(
      {
        stageName: data.stageName,
        birthYear: data.birthYear ? Number(data.birthYear) : undefined,
        introduction: data.introduction || undefined,
        nationality: data.nationality || undefined,
        height: data.height ? Number(data.height) : undefined,
        weight: data.weight ? Number(data.weight) : undefined,
        agency: data.agency || undefined,
        skills: data.skills?.length ? data.skills : undefined,
        languages: data.languages?.length ? data.languages : undefined,
      },
      {
        onSuccess: () => {
          toast.success("프로필이 저장되었습니다");
          router.push("/profile");
        },
        onError: () => {
          toast.error("프로필 저장에 실패했습니다");
        },
      }
    );
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <form onSubmit={onSubmit} className="w-full">
        <div className="max-w-4xl space-y-8">
          <PageHeader />

          <ProfileImageUpload
            imageUrl={actorProfile?.profileImage ?? ""}
            onImageChange={(file) => {
              if (!file) return;
              uploadImageMutation.mutate(file, {
                onSuccess: () => {
                  toast.success("프로필 이미지가 업로드되었습니다");
                },
                onError: () => {
                  toast.error("이미지 업로드에 실패했습니다");
                },
              });
            }}
            isUploading={uploadImageMutation.isPending}
          />

          <DarkCard>
            <h2 className="text-ivory mb-6 text-lg font-semibold">기본 정보</h2>
            <BasicInfoSection form={form} />
          </DarkCard>

          <DarkCard>
            <h2 className="text-ivory mb-6 text-lg font-semibold">특기 & 언어</h2>
            <SkillsSection form={form} />
          </DarkCard>

          <ActionButtons isLoading={updateMutation.isPending} onCancel={() => router.back()} />
        </div>
      </form>
    </DashboardLayout>
  );
}

function PageHeader() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-ivory text-2xl font-bold">프로필 수정</h1>
    </div>
  );
}

interface ActionButtonsProps {
  isLoading: boolean;
  onCancel: () => void;
}

function ActionButtons({ isLoading, onCancel }: ActionButtonsProps) {
  return (
    <div className="flex gap-3">
      <Button type="button" variant="gold-secondary" className="flex-1" onClick={onCancel}>
        취소
      </Button>
      <Button type="submit" variant="gold" className="flex-1" loading={isLoading}>
        저장
      </Button>
    </div>
  );
}
