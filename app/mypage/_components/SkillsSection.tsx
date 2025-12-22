"use client";

import Link from "next/link";
import { PencilIcon } from "./Icons";

// TODO: API에 skills 필드 추가되면 useGetMyProfile에서 가져오기
const TEMP_SKILLS = ["영어(원어민 수준)", "피아노", "검술", "승마", "와이어 액션", "현대 무용"];

export function SkillsSection() {
  return (
    <section className="px-5 py-6 border-t border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">스킬 및 특기</h2>
        <Link
          href="/mypage/settings/profile"
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
        >
          <PencilIcon className="w-4 h-4" />
          <span>수정하기</span>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {TEMP_SKILLS.map((skill, index) => (
          <span key={index} className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-full">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
