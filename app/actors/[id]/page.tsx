"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
      />
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

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
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

interface ShowreelItem {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

interface ActorDetail {
  id: string;
  name: string;
  birthYear: number;
  filmographyCount: number;
  description: string;
  profileImage: string;
  skills: string[];
  filmography: FilmographyItem[];
  showreels: ShowreelItem[];
}

const actorData: Record<string, ActorDetail> = {
  "1": {
    id: "1",
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
        type: "영화",
        title: "제목이 긴 경우 이런식으로 들어갈 예정입니다",
        role: "주연",
        character: "강민준",
        thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=280&fit=crop",
      },
      {
        id: "f2",
        year: 2023,
        type: "영화",
        title: "서울의 밤",
        role: "주연",
        character: "강민준",
        thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=280&fit=crop",
      },
      {
        id: "f3",
        year: 2022,
        type: "영화",
        title: "제목이 긴 경우 이런식으로 들어갈 예정입니다",
        role: "주연",
        character: "강민준",
        thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&h=280&fit=crop",
      },
      {
        id: "f4",
        year: 2022,
        type: "드라마",
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
  },
  "2": {
    id: "2",
    name: "이연기",
    birthYear: 1992,
    filmographyCount: 23,
    description: "감성을 담아 이야기를 전하는 배우",
    profileImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop&crop=face",
    skills: ["발레", "성악", "수영", "일본어"],
    filmography: [
      {
        id: "f1",
        year: 2023,
        type: "드라마",
        title: "봄날의 햇살",
        role: "주연",
        character: "서하늘",
        thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=280&fit=crop",
      },
    ],
    showreels: [
      {
        id: "s1",
        title: "2024 Showreel",
        duration: "2:45",
        thumbnail: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=400&h=225&fit=crop",
      },
    ],
  },
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

export default function ActorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const actor = actorData[id];

  if (!actor) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-500">배우 정보를 찾을 수 없습니다.</p>
          <Link href="/recommend" className="mt-4 text-teal-500 underline">
            돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const groupedFilmography = groupFilmographyByYear(actor.filmography);

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen pb-24">
        <section className="relative h-[480px]">
          <div className="absolute inset-0">
            <Image src={actor.profileImage} alt={actor.name} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
          </div>

          <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-4 pt-12 pb-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
            >
              <ChevronLeftIcon className="w-6 h-6 text-white" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <ShareIcon className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">{actor.name}</h1>
            <p className="text-white/80 text-sm mb-3">
              {actor.birthYear}년생 · 필모 {actor.filmographyCount}편
            </p>
            <p className="text-teal-300 text-sm">{actor.description}</p>
          </div>
        </section>

        <section className="px-5 py-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">필모그래피</h2>

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
          <h2 className="text-lg font-bold text-gray-900 mb-4">스킬 및 특기</h2>
          <div className="flex flex-wrap gap-2">
            {actor.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="px-5 py-6 border-t border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">대표 영상</h2>
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

        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100">
          <div className="max-w-lg mx-auto px-5 py-4 flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              <DownloadIcon className="w-5 h-5" />
              <span>포트폴리오</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-teal-400 rounded-xl text-white font-medium hover:bg-teal-500 transition-colors">
              <PhoneIcon className="w-5 h-5" />
              <span>연락하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
