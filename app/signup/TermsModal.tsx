"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "./icons";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgree: () => void;
}

interface TermItem {
  id: string;
  title: string;
  required: boolean;
  checked: boolean;
}

export default function TermsModal({ open, onOpenChange, onAgree }: TermsModalProps) {
  const [terms, setTerms] = useState<TermItem[]>([
    { id: "service", title: "서비스 이용약관 동의", required: true, checked: false },
    { id: "privacy", title: "개인정보 수집 및 이용 동의", required: true, checked: false },
    { id: "age", title: "만 14세 이상입니다", required: true, checked: false },
    { id: "marketing", title: "마케팅 정보 수신 동의", required: false, checked: false },
  ]);

  const allChecked = terms.every((term) => term.checked);
  const requiredChecked = terms.filter((term) => term.required).every((term) => term.checked);

  const handleAllCheck = (checked: boolean) => {
    setTerms(terms.map((term) => ({ ...term, checked })));
  };

  const handleTermCheck = (id: string, checked: boolean) => {
    setTerms(terms.map((term) => (term.id === id ? { ...term, checked } : term)));
  };

  const handleAgree = () => {
    if (requiredChecked) {
      onAgree();
      onOpenChange(false);
    }
  };

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (open) {
      setTerms(terms.map((term) => ({ ...term, checked: false })));
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg mx-auto w-[calc(100%-32px)] rounded-2xl p-0 gap-0">
        <DialogHeader className="p-5 pb-4 border-b border-gray-100">
          <DialogTitle className="text-lg font-semibold text-center">
            약관 동의
          </DialogTitle>
        </DialogHeader>

        <div className="p-5">
          {/* 전체 동의 */}
          <div
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer"
            onClick={() => handleAllCheck(!allChecked)}
          >
            <Checkbox
              id="all"
              checked={allChecked}
              onCheckedChange={handleAllCheck}
              className="w-6 h-6 rounded-full border-2 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
            />
            <label htmlFor="all" className="flex-1 text-base font-semibold text-gray-900 cursor-pointer">
              전체 동의
            </label>
          </div>

          {/* 구분선 */}
          <div className="my-4 border-t border-gray-100" />

          {/* 개별 약관 */}
          <div className="space-y-3">
            {terms.map((term) => (
              <div
                key={term.id}
                className="flex items-center gap-3 py-2 cursor-pointer"
                onClick={() => handleTermCheck(term.id, !term.checked)}
              >
                <Checkbox
                  id={term.id}
                  checked={term.checked}
                  onCheckedChange={(checked) => handleTermCheck(term.id, checked as boolean)}
                  className="w-5 h-5 rounded border-2 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                />
                <label htmlFor={term.id} className="flex-1 text-sm text-gray-700 cursor-pointer">
                  <span className={term.required ? "text-red-500" : "text-gray-400"}>
                    [{term.required ? "필수" : "선택"}]
                  </span>{" "}
                  {term.title}
                </label>
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    // 약관 상세 보기 로직
                  }}
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 동의 버튼 */}
        <div className="p-5 pt-2">
          <Button
            onClick={handleAgree}
            disabled={!requiredChecked}
            className={`w-full h-14 text-base font-semibold rounded-xl transition-all ${
              requiredChecked
                ? "bg-gray-900 hover:bg-gray-800 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            동의하고 가입하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

