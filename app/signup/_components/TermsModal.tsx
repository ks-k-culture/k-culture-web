"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "@/app/components/Icons";

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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
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

  const handleAllCheck = () => {
    const newChecked = !allChecked;
    setTerms(terms.map((term) => ({ ...term, checked: newChecked })));
  };

  const handleTermCheck = (id: string) => {
    setTerms(terms.map((term) => (term.id === id ? { ...term, checked: !term.checked } : term)));
  };

  const handleAgree = () => {
    if (requiredChecked) {
      onAgree();
      onOpenChange(false);
    }
  };

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTerms((prev) => prev.map((term) => ({ ...term, checked: false })));
    }
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-60" onClick={() => onOpenChange(false)} />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-70 animate-slide-up">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-center text-gray-900">약관 동의</h2>
        </div>

        <div className="px-5 py-4">
          <button
            type="button"
            onClick={handleAllCheck}
            className="flex items-center gap-3 w-full p-4 bg-gray-50 rounded-xl"
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                allChecked ? "bg-red-500" : "border-2 border-gray-300 bg-white"
              }`}
            >
              {allChecked && <CheckIcon className="w-4 h-4 text-white" />}
            </div>
            <span className="flex-1 text-left text-base font-semibold text-gray-900">전체 동의</span>
          </button>
          <div className="my-4 border-t border-gray-100" />
          <div className="space-y-1">
            {terms.map((term) => (
              <button
                key={term.id}
                type="button"
                onClick={() => handleTermCheck(term.id)}
                className="flex items-center gap-3 w-full py-3 px-1"
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    term.checked ? "bg-red-500" : "border-2 border-gray-300 bg-white"
                  }`}
                >
                  {term.checked && <CheckIcon className="w-3 h-3 text-white" />}
                </div>
                <span className="flex-1 text-left text-sm text-gray-700">
                  <span className={term.required ? "text-red-500" : "text-gray-400"}>
                    [{term.required ? "필수" : "선택"}]
                  </span>{" "}
                  {term.title}
                </span>
                <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
        <div className="px-5 pb-8 pt-2">
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
      </div>
    </>
  );
}
