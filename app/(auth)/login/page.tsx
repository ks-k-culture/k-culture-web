"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button, FormField, Input, PasswordInput } from "@/components/ui";

import { AuthLayout } from "@/components/common";

import { type LoginFormData, loginFormSchema } from "@/lib/validations";

import { useAuthStore } from "@/stores/useAuthStore";

import { useLogin } from "@/src/auth/auth";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(
      { data },
      {
        onSuccess: (response) => {
          if (response.data) {
            const { accessToken, user } = response.data;
            if (accessToken && user) {
              login(accessToken, user.type);
            }
          }
          toast.success("로그인 성공!");
          router.push("/dashboard");
        },
        onError: () => {
          setError("root", {
            message: "이메일 또는 비밀번호가 올바르지 않습니다.",
          });
          toast.error("이메일 또는 비밀번호가 올바르지 않습니다");
        },
      }
    );
  });

  return (
    <AuthLayout title="로그인" subtitle="두드림에 오신 것을 환영합니다">
      <form onSubmit={onSubmit} className="space-y-6">
        <FormField label="이메일" error={errors.email?.message || errors.root?.message}>
          <Input
            type="email"
            placeholder="이메일 주소를 입력하세요"
            {...register("email")}
            error={!!errors.email || !!errors.root}
          />
        </FormField>

        <FormField label="비밀번호" error={errors.password?.message}>
          <PasswordInput
            placeholder="비밀번호를 입력하세요"
            {...register("password")}
            error={!!errors.password || !!errors.root}
          />
        </FormField>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-muted-gray hover:text-gold text-sm transition-colors">
            비밀번호를 잊으셨나요?
          </Link>
        </div>

        <Button type="submit" variant="gold" fullWidth loading={loginMutation.isPending}>
          로그인
        </Button>

        <div className="text-center">
          <span className="text-muted-gray">계정이 없으신가요? </span>
          <Link href="/signup" className="text-gold hover:text-gold-light transition-colors">
            회원가입
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
