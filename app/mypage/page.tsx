"use client";

import Image from "next/image";
import Link from "next/link";

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
      />
    </svg>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
      />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

interface FilmographyItem {
  id: string;
  year: number;
  type: "영화" | "드라마";
  title: string;
  role: string;
  character?: string;
  thumbnail: string;
}

const myActorData = {
  id: "me",
  name: "김배우",
  birthYear: 1990,
  filmographyCount: 15,
  description: "깊은 눈빛으로 서사를 만드는 배우",
  profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop&crop=face",
  skills: ["영어(원어민 수준)", "피아노", "검술", "승마", "와이어 액션", "현대 무용"],
  filmography: [
    {
      id: "f1",
      year: 2023,
      type: "영화" as const,
      title: "제목이 긴 경우 이런식으로 들어갈 예정입니다",
      role: "주연",
      character: "강민준",
      thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=280&fit=crop",
    },
    {
      id: "f2",
      year: 2023,
      type: "영화" as const,
      title: "서울의 밤",
      role: "주연",
      character: "강민준",
      thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=280&fit=crop",
    },
    {
      id: "f3",
      year: 2022,
      type: "영화" as const,
      title: "제목이 긴 경우 이런식으로 들어갈 예정입니다",
      role: "주연",
      character: "강민준",
      thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&h=280&fit=crop",
    },
    {
      id: "f4",
      year: 2022,
      type: "드라마" as const,
      title: "코드네임 : 그림자",
      role: "조연",
      character: "에이전트 7",
      thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&h=280&fit=crop",
    },
  ],
  showreels: [
    {
      id: "s1",
      title: "2024 Actor Showreel",
      duration: "3:15",
      thumbnail: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=400&h=225&fit=crop",
    },
    {
      id: "s2",
      title: "2024 Actor Showreel",
      duration: "3:15",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
    },
  ],
};

function groupFilmographyByYear(filmography: FilmographyItem[]) {
  const grouped: Record<number, FilmographyItem[]> = {};
  filmography.forEach((item) => {
    if (!grouped[item.year]) {
      grouped[item.year] = [];
    }
    grouped[item.year].push(item);
  });
  return Object.entries(grouped)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, items]) => ({ year: Number(year), items }));
}

export default function MyPage() {
  const actor = myActorData;
  const groupedFilmography = groupFilmographyByYear(actor.filmography);

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen pb-24">
        <header className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-5 pt-12 pb-4">
          <h1 className="text-lg font-semibold text-white">마이페이지</h1>
          <button className="w-10 h-10 flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-white" />
          </button>
        </header>

        <section className="relative h-[420px]">
          <div className="absolute inset-0">
            <Image src={actor.profileImage} alt={actor.name} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">{actor.name}</h2>
            <p className="text-white/80 text-sm mb-2">
              {actor.birthYear}년생 · 필모 {actor.filmographyCount}편
            </p>
            <p className="text-teal-300 text-sm mb-5">{actor.description}</p>

            <div className="flex gap-3 justify-center">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-white/30 transition-colors">
                <PencilIcon className="w-4 h-4" />
                <span>수정하기</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 rounded-full text-white text-sm font-medium hover:bg-rose-600 transition-colors">
                <HeartIcon className="w-4 h-4" />
                <span>팬에게 후원받기</span>
              </button>
            </div>
          </div>
        </section>

        <section className="px-5 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">필모그래피</h2>
            <Link
              href="/mypage/filmography"
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
            >
              <PencilIcon className="w-4 h-4" />
              <span>수정하기</span>
            </Link>
          </div>

          {groupedFilmography.map(({ year, items }) => (
            <div key={year} className="mb-8">
              <h3 className="text-base font-semibold text-gray-900 mb-4">{year}</h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-22 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        width={64}
                        height={88}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-gray-400 mb-1 block">{item.type}</span>
                      <h4 className="text-sm font-medium text-gray-900 leading-snug mb-1 line-clamp-2">{item.title}</h4>
                      <p className="text-xs text-gray-500">
                        {item.role} · {item.character}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="px-5 py-6 border-t border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">스킬 및 특기</h2>
            <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
              <PencilIcon className="w-4 h-4" />
              <span>수정하기</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {actor.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="px-5 py-6 border-t border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">대표 영상</h2>
            <Link href="/mypage/showreel" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
              <PencilIcon className="w-4 h-4" />
              <span>수정하기</span>
            </Link>
          </div>
          <div className="space-y-4">
            {actor.showreels.map((showreel) => (
              <div key={showreel.id} className="group cursor-pointer">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-2">
                  <Image
                    src={showreel.thumbnail}
                    alt={showreel.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <PlayIcon className="w-6 h-6 text-gray-800 ml-1" />
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-900">{showreel.title}</h3>
                <p className="text-xs text-gray-400">{showreel.duration}</p>
              </div>
            ))}
          </div>
        </section>

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
            <p className="text-xs text-[#4E5968] leading-relaxed">
              광고를 통해 캐스팅 디렉터에게 나를 먼저 보여 보세요
            </p>
          </Link>
        </section>

        <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100">
          <div className="max-w-lg mx-auto flex justify-around items-center py-2">
            <Link href="/" className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400">
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs">홈</span>
            </Link>
            <Link href="/recommend" className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400">
              <SparklesIcon className="w-6 h-6" />
              <span className="text-xs">AI매칭</span>
            </Link>
            <Link href="#" className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400">
              <BookmarkIcon className="w-6 h-6" />
              <span className="text-xs">찜목록</span>
            </Link>
            <Link href="/mypage" className="flex flex-col items-center gap-1 px-4 py-2 text-gray-900">
              <UserIcon className="w-6 h-6" />
              <span className="text-xs font-medium">마이페이지</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
