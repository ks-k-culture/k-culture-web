import { Button } from "@/components/ui";

import { DarkCard } from "@/components/common";
import { UserIcon } from "@/components/common/Misc/Icons";

interface AccountInfoSectionProps {
  userEmail: string;
  userType: "actor" | "agency";
  onChangePassword: () => void;
}

export function AccountInfoSection({ userEmail, userType, onChangePassword }: AccountInfoSectionProps) {
  return (
    <DarkCard>
      <div className="mb-6 flex items-center gap-4">
        <div className="bg-gold/10 flex h-10 w-10 items-center justify-center rounded-full">
          <UserIcon className="text-gold h-5 w-5" />
        </div>
        <div>
          <h2 className="text-ivory text-lg font-semibold">계정 정보</h2>
          <p className="text-muted-gray text-sm">로그인 및 계정 관리</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="border-border flex items-center justify-between border-b py-3">
          <div>
            <p className="text-ivory">이메일</p>
            <p className="text-muted-gray text-sm">{userEmail}</p>
          </div>
        </div>

        <div className="border-border flex items-center justify-between border-b py-3">
          <div>
            <p className="text-ivory">비밀번호</p>
            <p className="text-muted-gray text-sm">••••••••</p>
          </div>
          <Button variant="gold-ghost" size="sm" onClick={onChangePassword}>
            변경
          </Button>
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-ivory">회원 유형</p>
            <p className="text-muted-gray text-sm">{userType === "actor" ? "배우" : "에이전시"}</p>
          </div>
        </div>
      </div>
    </DarkCard>
  );
}
