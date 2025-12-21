import Link from "next/link";

export function PromoSection() {
  return (
    <section className="px-5 py-6 border-t border-gray-100 space-y-3">
      <Link href="#" className="block p-5 bg-[#F9FAFB] rounded-xl hover:bg-gray-100 transition-colors">
        <div className="mb-4">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.25 5.4168L12.5833 8.7501M1.33325 16.6668H4.66659L13.4166 7.9168C13.8586 7.4747 14.1069 6.8752 14.1069 6.2501C14.1069 5.625 13.8586 5.0254 13.4166 4.5834C12.9745 4.1414 12.375 3.8931 11.7499 3.8931C11.1248 3.8931 10.5253 4.1414 10.0833 4.5834L1.33325 13.3334V16.6668Z"
              stroke="#E50815"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-[#191F28] mb-1">프리미엄 포트폴리오 꾸미기</h3>
        <p className="text-xs text-[#4E5968] leading-relaxed">웹툴킷 마켓에서 더 개성있는 프로필을 만들어 보세요</p>
      </Link>

      <Link href="#" className="block p-5 bg-[#F9FAFB] rounded-xl hover:bg-gray-100 transition-colors">
        <div className="mb-4">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3.83333 11.666L6.33333 9.166L8 10.833L10.5 8.333L12.1667 10M1.33325 15V5C1.33325 4.558 1.50885 4.134 1.82141 3.821C2.13397 3.509 2.55789 3.333 2.99992 3.333H12.9999C13.4419 3.333 13.8659 3.509 14.1784 3.821C14.491 4.134 14.6666 4.558 14.6666 5V15C14.6666 15.442 14.491 15.866 14.1784 16.178C13.8659 16.491 13.4419 16.666 12.9999 16.666H2.99992C2.55789 16.666 2.13397 16.491 1.82141 16.178C1.50885 15.866 1.33325 15.442 1.33325 15Z"
              stroke="#E50815"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-[#191F28] mb-1">프로필 상단 노출</h3>
        <p className="text-xs text-[#4E5968] leading-relaxed">광고를 통해 캐스팅 디렉터에게 나를 먼저 보여 보세요</p>
      </Link>
    </section>
  );
}

