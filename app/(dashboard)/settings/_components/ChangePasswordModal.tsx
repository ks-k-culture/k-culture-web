"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui";

import { FormInput } from "@/components/common/Form";
import { Modal } from "@/components/common/Misc";

import { useChangePassword } from "@/src/users/users";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요"),
    newPassword: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "영문, 숫자, 특수문자를 포함해야 합니다"
      ),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate(
      { data },
      {
        onSuccess: () => {
          toast.success("비밀번호가 변경되었습니다");
          reset();
          onClose();
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { error?: { message?: string } } } };
          const message = err?.response?.data?.error?.message || "비밀번호 변경에 실패했습니다";
          toast.error(message);
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="비밀번호 변경">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormInput
          type="password"
          label="현재 비밀번호"
          required
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
          placeholder="현재 비밀번호를 입력하세요"
        />

        <FormInput
          type="password"
          label="새 비밀번호"
          required
          error={errors.newPassword?.message}
          {...register("newPassword")}
          placeholder="새 비밀번호를 입력하세요"
          hint="8자 이상, 영문/숫자/특수문자 포함"
        />

        <FormInput
          type="password"
          label="새 비밀번호 확인"
          required
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
          placeholder="새 비밀번호를 다시 입력하세요"
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={handleClose}>
            취소
          </Button>
          <Button type="submit" variant="gold" disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? "변경 중..." : "변경"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
