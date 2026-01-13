"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button, FormField, Input, PasswordInput } from "@/components/ui";

import { AuthLayout } from "@/components/common";

import { TermsAgreementSection } from "@/components/auth/TermsAgreementSection";

import { type SignupFormData, signupFormSchema } from "@/lib/validations";

import { useAuthStore } from "@/stores/useAuthStore";

import { useLogin, useSignup } from "@/src/auth/auth";

const SIGNUP_CONFIG = {
  actor: {
    title: "배우 회원가입",
    subtitle: "프로필을 등록하고 캐스팅 기회를 받으세요",
    onboardingPath: "/onboarding/actor/step1?new=true",
  },
  agency: {
    title: "캐스팅 담당자 회원가입",
    subtitle: "AI로 완벽한 배우를 찾아보세요",
    onboardingPath: "/onboarding/agency/step1?new=true",
  },
} as const;

export default function SignupPage() {
  const params = useParams();
  const router = useRouter();
  const signupMutation = useSignup();
  const loginMutation = useLogin();
  const login = useAuthStore((state) => state.login);

  const type = params.type as "actor" | "agency";
  const config = SIGNUP_CONFIG[type];

  if (!config) {
    router.push("/signup/actor");
    return null;
  }

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      termsAgreed: false,
      privacyAgreed: false,
      marketingAgreed: false,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = form;

  const onSubmit = handleSubmit((data) => {
    signupMutation.mutate(
      {
        data: {
          email: data.email,
          password: data.password,
          passwordConfirm: data.passwordConfirm,
          type,
          termsAgreed: data.termsAgreed,
          privacyAgreed: data.privacyAgreed,
          marketingAgreed: data.marketingAgreed || false,
        },
      },
      {
        onSuccess: () => {
          const { email, password } = getValues();
          loginMutation.mutate(
            { data: { email, password } },
            {
              onSuccess: (response) => {
                if (response.data) {
                  const { accessToken, user } = response.data;
                  if (accessToken && user) {
                    login(accessToken, user.type);
                  }
                }
                toast.success("회원가입이 완료되었습니다");
                router.push(config.onboardingPath);
              },
              onError: () => {
                toast.success("회원가입이 완료되었습니다. 로그인해주세요.");
                router.push("/login");
              },
            }
          );
        },
        onError: () => {
          toast.error("회원가입에 실패했습니다");
        },
      }
    );
  });

  const isLoading = signupMutation.isPending || loginMutation.isPending;

  return (
    <AuthLayout title={config.title} subtitle={config.subtitle}>
      <form onSubmit={onSubmit} className="space-y-5">
        <FormField label="이메일" error={errors.email?.message}>
          <Input
            type="email"
            placeholder={type === "agency" ? "업무용 이메일을 입력하세요" : "이메일 주소를 입력하세요"}
            {...register("email")}
            error={!!errors.email}
          />
        </FormField>

        <FormField label="비밀번호" error={errors.password?.message} hint="영문, 숫자를 포함한 8자 이상">
          <PasswordInput placeholder="8자 이상 입력하세요" {...register("password")} error={!!errors.password} />
        </FormField>

        <FormField label="비밀번호 확인" error={errors.passwordConfirm?.message}>
          <PasswordInput
            placeholder="비밀번호를 다시 입력하세요"
            {...register("passwordConfirm")}
            error={!!errors.passwordConfirm}
          />
        </FormField>

        <TermsAgreementSection watch={watch} setValue={setValue} errors={errors} />

        <Button type="submit" variant="gold" fullWidth disabled={!isValid} loading={isLoading}>
          회원가입
        </Button>

        <div className="text-center">
          <span className="text-muted-gray">이미 계정이 있으신가요? </span>
          <Link href="/login" className="text-gold hover:text-gold-light transition-colors">
            로그인
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
