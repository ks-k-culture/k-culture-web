import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import ActorCarousel from "../components/ActorCarousel";
import type { Actor } from "../components/ActorCarousel";

// 샘플 데이터
const sampleActors: Actor[] = [
  {
    id: "1",
    name: "김배우",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=533&fit=crop&crop=face",
    age: "20대 중반",
    filmography: 15,
    tags: ["섬세한연기", "청춘물감정", "카리스마"],
  },
  {
    id: "2",
    name: "이연기",
    imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=533&fit=crop&crop=face",
    age: "30대 초반",
    filmography: 23,
    tags: ["감성연기", "로맨스", "멜로"],
  },
  {
    id: "3",
    name: "박스타",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=533&fit=crop&crop=face",
    age: "20대 후반",
    filmography: 8,
    tags: ["신선함", "액션", "코미디"],
  },
  {
    id: "4",
    name: "최연기",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=533&fit=crop&crop=face",
    age: "20대 초반",
    filmography: 5,
    tags: ["풋풋함", "학원물", "성장드라마"],
  },
  {
    id: "5",
    name: "정배우",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=533&fit=crop&crop=face",
    age: "30대 중반",
    filmography: 42,
    tags: ["베테랑", "극한연기", "몰입력"],
  },
];

const filterOptions = [
  { id: "age", label: "나이대" },
  { id: "gender", label: "성별" },
  { id: "region", label: "활동 지역" },
  { id: "filmography", label: "필모 수" },
];

export default function RecommendPage() {
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen flex flex-col overflow-hidden">
        <Header title="역 추천 배우" highlightedName="서은우" />

        <FilterBar filters={filterOptions} />

        <main className="flex-1 flex flex-col justify-between pb-5">
          <ActorCarousel actors={sampleActors} />
        </main>
      </div>
    </div>
  );
}
