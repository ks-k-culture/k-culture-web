"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export interface Actor {
  id: string;
  name: string;
  imageUrl: string;
  age: string;
  filmography: number;
  tags: string[];
  works?: { name: string; thumbnail: string }[];
}

interface ActorCarouselProps {
  actors: Actor[];
}

export default function ActorCarousel({ actors }: ActorCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const activeActor = actors[activeIndex];

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : actors.length - 1));
  }, [actors.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev < actors.length - 1 ? prev + 1 : 0));
  }, [actors.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      goToNext();
    }
    if (touchStart - touchEnd < -50) {
      goToPrev();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext]);

  // Get side cards
  const getCardIndex = (offset: number) => {
    const index = activeIndex + offset;
    if (index < 0) return actors.length + index;
    if (index >= actors.length) return index - actors.length;
    return index;
  };

  const leftCard = actors[getCardIndex(-1)];
  const rightCard = actors[getCardIndex(1)];

  // 샘플 필모그래피 데이터
  const sampleWorks = [
    { name: "나의아저씨", thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=48&h=48&fit=crop" },
    { name: "미스터선샤인", thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=48&h=48&fit=crop" },
    { name: "시그널", thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=48&h=48&fit=crop" },
    { name: "비밀의숲", thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=48&h=48&fit=crop" },
  ];

  return (
    <div className="w-full flex flex-col overflow-hidden">
      {/* Main Carousel Area */}
      <div
        className="relative flex items-center justify-center gap-3 px-5 py-4"
        style={{ height: "400px" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left Side Card */}
        <button
          onClick={goToPrev}
          className="shrink-0 flex flex-col justify-end items-center"
          style={{ width: "184px", height: "332px" }}
        >
          {/* Card Image */}
          <div
            className="absolute rounded-md overflow-hidden bg-white"
            style={{
              width: "160px",
              height: "226px",
              bottom: "32px",
              zIndex: 0,
            }}
          >
            <Image src={leftCard.imageUrl} alt={leftCard.name} fill className="object-cover" sizes="160px" />
          </div>
          {/* Card Bottom Blur */}
          <div
            className="relative w-full"
            style={{
              height: "137px",
              background: "rgba(145, 158, 171, 0.16)",
              border: "0.8px solid rgba(25, 31, 40, 0.1)",
              backdropFilter: "blur(7px)",
              borderRadius: "1.6px 1.6px 16px 16px",
              zIndex: 1,
            }}
          />
        </button>

        {/* Center Active Card */}
        <div
          className="shrink-0 flex flex-col justify-end items-center relative"
          style={{ width: "230px", height: "400px" }}
        >
          {/* Card Image */}
          <div
            className="absolute rounded-md overflow-hidden"
            style={{
              width: "200px",
              height: "283px",
              top: "0.5px",
              left: "calc(50% - 100px)",
              zIndex: 0,
            }}
          >
            <Image
              src={activeActor.imageUrl}
              alt={activeActor.name}
              fill
              className="object-cover"
              sizes="200px"
              priority
            />
          </div>
          {/* Card Bottom Blur */}
          <div
            className="relative w-full"
            style={{
              height: "160px",
              background: "rgba(145, 158, 171, 0.16)",
              border: "1px solid rgba(25, 31, 40, 0.1)",
              backdropFilter: "blur(7px)",
              borderRadius: "2px 2px 20px 20px",
              zIndex: 1,
            }}
          />
        </div>

        {/* Right Side Card */}
        <button
          onClick={goToNext}
          className="shrink-0 flex flex-col justify-end items-center"
          style={{ width: "185px", height: "332px" }}
        >
          {/* Card Image */}
          <div
            className="absolute rounded-md overflow-hidden bg-white"
            style={{
              width: "160px",
              height: "226px",
              bottom: "32px",
              zIndex: 0,
            }}
          >
            <Image src={rightCard.imageUrl} alt={rightCard.name} fill className="object-cover" sizes="160px" />
          </div>
          {/* Card Bottom Blur */}
          <div
            className="relative w-full"
            style={{
              height: "137px",
              background: "rgba(145, 158, 171, 0.16)",
              border: "0.8px solid rgba(25, 31, 40, 0.1)",
              backdropFilter: "blur(7px)",
              borderRadius: "1.6px 1.6px 16px 16px",
              zIndex: 1,
            }}
          />
        </button>
      </div>

      {/* Actor Info Section */}
      <div className="flex flex-col items-center px-5 py-4 gap-8">
        {/* Actor Details */}
        <div className="flex flex-col items-center gap-3">
          {/* Name */}
          <h2
            className="font-bold text-[#191F28]"
            style={{ fontSize: "24px", lineHeight: "28px", letterSpacing: "-0.022em" }}
          >
            {activeActor.name}
          </h2>

          {/* Age & Filmography */}
          <p className="text-base text-[#4E5968]" style={{ letterSpacing: "-0.02em" }}>
            {activeActor.age} · 필모 {activeActor.filmography}편
          </p>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {activeActor.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-sm font-medium text-[#4E5968] rounded"
                style={{
                  background: "rgba(78, 89, 104, 0.1)",
                  letterSpacing: "-0.02em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Filmography Chips */}
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar w-full justify-center">
          {sampleWorks.map((work, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 px-3 py-1.5 shrink-0"
              style={{
                border: "1px solid #E5E8EB",
                borderRadius: "999px",
              }}
            >
              <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                <Image src={work.thumbnail} alt={work.name} width={24} height={24} className="object-cover" />
              </div>
              <span
                className="text-xs font-medium text-[#4E5968]"
                style={{ letterSpacing: "-0.02em" }}
              >
                {work.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
