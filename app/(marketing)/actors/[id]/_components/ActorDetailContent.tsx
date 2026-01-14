"use client";

import { useCallback, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { PageLayout } from "@/components/common";

import { useAuthStore } from "@/stores/useAuthStore";

import { useContactActor, useGetActorDetail } from "@/src/actors/actors";
import { getGetFavoritesQueryKey, useAddFavorite, useDeleteFavorite, useGetFavorites } from "@/src/favorites/favorites";
import { FavoriteType } from "@/src/model";

import { ActorProfileHeader, CastingRequestModal, ContactInfoModal } from "./";

function ActorDetailSkeleton() {
  return (
    <PageLayout className="animate-pulse">
      <div className="bg-luxury-secondary h-16" />
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 space-y-4 p-6 lg:max-w-md">
          <div className="bg-luxury-secondary h-8 w-48 rounded" />
          <div className="bg-luxury-secondary h-4 w-32 rounded" />
          <div className="bg-luxury-secondary h-24 w-full rounded" />
        </div>
        <div className="bg-luxury-secondary aspect-[3/4] flex-1 lg:aspect-auto lg:h-[600px]" />
      </div>
    </PageLayout>
  );
}

interface ActorDetailContentProps {
  actorId: string;
}

// 분위기/이미지 태그 예시 (실제로는 백엔드에서 가져와야 함)
const MOOD_TAGS = ["사랑스러운", "우아한", "차분한", "시크한", "밝은"];

export function ActorDetailContent({ actorId }: ActorDetailContentProps) {
  const queryClient = useQueryClient();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCastingModal, setShowCastingModal] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 배우 상세 정보 조회
  const { data, isLoading } = useGetActorDetail(actorId, {
    query: { enabled: !!actorId },
  });

  // 섭외 요청
  const { mutate: contactActor, isPending: isContacting } = useContactActor();

  // 찜 관련
  const { data: favoritesData } = useGetFavorites(
    isAuthenticated ? { type: "actor" as unknown as FavoriteType } : undefined,
    { query: { enabled: isAuthenticated } }
  );
  const addFavoriteMutation = useAddFavorite();
  const deleteFavoriteMutation = useDeleteFavorite();

  const actor = data?.data;

  // 현재 배우가 찜 되어 있는지 확인
  type BackendFavoriteResponse = {
    content: Array<{ id: string; targetId: string }>;
  };
  const favoritesContent = (favoritesData?.data as unknown as BackendFavoriteResponse)?.content || [];
  const favoriteItem = favoritesContent.find((fav) => fav.targetId === actor?.id);
  const isFavorited = !!favoriteItem;

  const handleFavoriteClick = useCallback(() => {
    if (!isAuthenticated || !actor) return;

    if (isFavorited && favoriteItem?.id) {
      deleteFavoriteMutation.mutate(
        { favoriteId: favoriteItem.id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: getGetFavoritesQueryKey(),
            });
            toast.success("찜 목록에서 삭제되었습니다");
          },
        }
      );
    } else {
      addFavoriteMutation.mutate(
        { data: { type: FavoriteType.actor, targetId: actor.id } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: getGetFavoritesQueryKey(),
            });
            toast.success("찜 목록에 추가되었습니다");
          },
        }
      );
    }
  }, [isAuthenticated, isFavorited, favoriteItem, actor, addFavoriteMutation, deleteFavoriteMutation, queryClient]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: `${actor?.name || "배우"} 프로필`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("링크가 복사되었습니다");
    }
  }, [actor?.name]);

  const handleCastingRequest = (message: string) => {
    if (!actor) return;
    contactActor(
      {
        actorId: actor.id,
        data: {
          projectId: "",
          message,
        },
      },
      {
        onSuccess: () => {
          setShowCastingModal(false);
          toast.success("섭외 요청이 전송되었습니다!");
        },
        onError: () => {
          toast.error("섭외 요청 전송에 실패했습니다");
        },
      }
    );
  };

  if (isLoading) {
    return <ActorDetailSkeleton />;
  }

  if (!actor) {
    return (
      <PageLayout className="items-center justify-center">
        <div className="text-center">
          <p className="text-muted-gray">배우 정보를 찾을 수 없습니다.</p>
          <Link href="/actor-search" className="text-gold hover:text-gold-light mt-4 underline">
            돌아가기
          </Link>
        </div>
      </PageLayout>
    );
  }

  // 백엔드 응답 타입 캐스팅
  type BackendActorDetail = {
    id: string;
    email: string;
    name: string;
    stageName?: string;
    profileImage?: string;
    birthYear?: number;
    introduction?: string;
    nationality?: string;
    height?: number;
    weight?: number;
    skills?: string[];
    languages?: string[];
    agency?: string;
    isProfileComplete?: boolean;
    gender?: string;
    viewCount?: number;
    likeCount?: number;
  };
  const actorData = actor as unknown as BackendActorDetail;

  // 가상의 프로필 사진들 (실제로는 백엔드에서 가져와야 함)
  const profilePhotos = actorData.profileImage ? [actorData.profileImage] : [];

  return (
    <PageLayout className="bg-luxury-black">
      {/* 프로필 헤더 */}
      <ActorProfileHeader
        name={actorData.stageName || actorData.name}
        englishName={actorData.stageName ? actorData.name : undefined}
        birthYear={actorData.birthYear}
        introduction={actorData.introduction}
        profileImage={actorData.profileImage}
        height={actorData.height}
        weight={actorData.weight}
        nationality={actorData.nationality}
        gender={actorData.gender}
        agency={actorData.agency}
        viewCount={actorData.viewCount || 0}
        likeCount={actorData.likeCount || 0}
        isFavorited={isFavorited}
        onFavoriteClick={handleFavoriteClick}
        onShareClick={handleShare}
      />

      {/* 분위기/이미지 태그 */}
      <section className="bg-luxury-black px-6 py-6">
        <div className="flex flex-wrap gap-2">
          {MOOD_TAGS.map((tag) => (
            <span
              key={tag}
              className="border-ivory/30 text-ivory/80 rounded-full border px-4 py-2 text-sm transition-colors hover:border-purple-500 hover:text-purple-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* 특기 태그 */}
      {actorData.skills && actorData.skills.length > 0 && (
        <section className="bg-luxury-black px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {actorData.skills.map((skill, i) => (
              <span key={i} className="border-gold/50 text-gold rounded-full border px-4 py-2 text-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 가능 언어 태그 */}
      {actorData.languages && actorData.languages.length > 0 && (
        <section className="bg-luxury-black px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {actorData.languages.map((lang, i) => (
              <span key={i} className="text-ivory border-ivory/30 rounded-full border px-4 py-2 text-sm">
                {lang}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 소셜 미디어 링크 (예시) */}
      <section className="bg-luxury-black flex gap-3 px-6 py-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition-transform hover:scale-110">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white transition-transform hover:scale-110">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </button>
      </section>

      {/* 가격 정보 */}
      <section className="bg-luxury-secondary border-border border-y px-6 py-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="text-muted-gray text-sm">영화</span>
            <p className="text-ivory text-sm">₩100,000원부터 ~</p>
          </div>
          <div>
            <span className="text-muted-gray text-sm">광고</span>
            <p className="text-ivory text-sm">₩100,000원부터 ~</p>
          </div>
          <div>
            <span className="text-muted-gray text-sm">품앗이</span>
            <p className="text-gold text-sm">가능</p>
          </div>
        </div>
      </section>

      {/* 연기영상 섹션 */}
      <section className="bg-luxury-black px-6 py-8">
        <h2 className="text-heading-md text-ivory border-border mb-6 border-b pb-2">연기영상</h2>
        <div className="text-muted-gray py-12 text-center">
          <p>등록된 연기영상이 없습니다.</p>
        </div>
      </section>

      {/* 프로필 사진 갤러리 */}
      <section className="bg-luxury-black px-6 py-8">
        <h2 className="text-heading-md text-ivory border-border mb-6 border-b pb-2">프로필 사진</h2>
        {profilePhotos.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {profilePhotos.map((photo, i) => (
              <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-lg">
                <Image
                  src={photo}
                  alt={`프로필 사진 ${i + 1}`}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-gray py-12 text-center">
            <p>등록된 프로필 사진이 없습니다.</p>
          </div>
        )}
      </section>

      {/* 출연 이미지 갤러리 */}
      <section className="bg-luxury-black px-6 py-8">
        <h2 className="text-heading-md text-ivory border-border mb-6 border-b pb-2">출연 이미지</h2>
        <div className="text-muted-gray py-12 text-center">
          <p>등록된 출연 이미지가 없습니다.</p>
        </div>
      </section>

      {/* 인라인 섭외 요청 폼 */}
      <section className="bg-luxury-secondary px-6 py-10">
        <h2 className="text-heading-lg text-ivory mb-8 text-center">
          지금 보고 계신 <span className="text-gold">{actorData.stageName || actorData.name}</span> 님을 섭외하고
          싶으신가요?
        </h2>

        <form
          className="mx-auto max-w-2xl space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const message = `소속: ${formData.get("company")}\n담당자: ${formData.get("manager")}\n메시지: ${formData.get("message")}\n연락처: ${formData.get("contact")}`;
            handleCastingRequest(message);
          }}
        >
          <input
            name="company"
            type="text"
            placeholder="소속을 입력해 주세요."
            className="bg-luxury-tertiary text-ivory placeholder:text-muted-gray border-border focus:border-gold w-full rounded-lg border px-4 py-3 transition-colors outline-none"
          />
          <input
            name="manager"
            type="text"
            placeholder="담당자님 성함을 입력해 주세요."
            className="bg-luxury-tertiary text-ivory placeholder:text-muted-gray border-border focus:border-gold w-full rounded-lg border px-4 py-3 transition-colors outline-none"
          />
          <textarea
            name="message"
            rows={4}
            placeholder="전달하고 싶은 메시지를 입력해 주세요. 작품제목과 출연날짜 등 구체적으로 작성 부탁드립니다."
            className="bg-luxury-tertiary text-ivory placeholder:text-muted-gray border-border focus:border-gold w-full resize-none rounded-lg border px-4 py-3 transition-colors outline-none"
          />
          <input
            name="contact"
            type="text"
            placeholder="답장을 받으실 연락처(전화번호 또는 이메일)를 입력해 주세요."
            className="bg-luxury-tertiary text-ivory placeholder:text-muted-gray border-border focus:border-gold w-full rounded-lg border px-4 py-3 transition-colors outline-none"
          />
          <button
            type="submit"
            disabled={isContacting}
            className="bg-gold text-luxury-black hover:bg-gold-light w-full rounded-full py-4 text-lg font-semibold transition-colors disabled:opacity-50"
          >
            {isContacting ? "전송 중..." : "섭외 요청하기"}
          </button>
        </form>

        <p className="text-muted-gray mt-6 text-center text-sm">
          섭외 요청 시, 섭외요청 확인 메일(또는 문자) 발송 후 48시간 이내에 캐스팅 가능 여부를 확인하실 수 있습니다.
          <br />
          <span className="text-gold">작품 제작을 위한 연락이 아닐 시 서비스 이용에 제한될 수 있습니다.</span>
        </p>
      </section>

      {/* 모달들 */}
      <ContactInfoModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        phone={actorData.name}
        email={actorData.email || `${actorData.name.toLowerCase()}@actor.com`}
      />

      <CastingRequestModal
        isOpen={showCastingModal}
        onClose={() => setShowCastingModal(false)}
        onSubmit={handleCastingRequest}
        actorName={actorData.stageName || actorData.name}
        isSubmitting={isContacting}
      />
    </PageLayout>
  );
}
