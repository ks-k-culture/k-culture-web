"use client";

import { useEffect, useMemo, useRef } from "react";

import { createPortal } from "react-dom";

import { XIcon } from "@/components/common/Misc/Icons";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
}

function getEmbedUrl(url: string): string | null {
  const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
  }

  const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return url;
  }

  return null;
}

export function VideoPlayerModal({ isOpen, onClose, videoUrl, title }: VideoPlayerModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const embedUrl = useMemo(() => getEmbedUrl(videoUrl), [videoUrl]);
  const isDirectVideo = useMemo(() => videoUrl.match(/\.(mp4|webm|ogg)$/i), [videoUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const content = (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
    >
      <div className="relative w-full max-w-5xl">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 flex items-center gap-2 text-white/80 transition-colors hover:text-white"
        >
          <span className="text-sm">닫기</span>
          <XIcon className="h-6 w-6" />
        </button>

        {title && <h3 className="mb-4 truncate text-lg font-medium text-white">{title}</h3>}

        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
          {embedUrl ? (
            isDirectVideo ? (
              <video src={embedUrl} controls autoPlay className="h-full w-full" controlsList="nodownload">
                브라우저가 비디오 재생을 지원하지 않습니다.
              </video>
            ) : (
              <iframe
                src={embedUrl}
                title={title || "쇼릴 영상"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            )
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white/60">
              <div className="text-center">
                <p className="mb-2">지원하지 않는 영상 형식입니다</p>
                <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                  외부에서 열기 →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
