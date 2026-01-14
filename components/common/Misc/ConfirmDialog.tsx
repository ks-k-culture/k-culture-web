"use client";

import { type ReactNode, useCallback, useEffect, useRef } from "react";
import { useState } from "react";

import { createPortal } from "react-dom";

import { Button } from "@/components/ui";

import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
  icon?: ReactNode;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "확인",
  description,
  confirmText = "확인",
  cancelText = "취소",
  variant = "default",
  icon,
  isLoading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    },
    [onClose, isLoading]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current && !isLoading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: "bg-red-500/20",
      iconColor: "text-red-500",
      button: "bg-red-600 hover:bg-red-700 text-white",
    },
    warning: {
      icon: "bg-yellow-500/20",
      iconColor: "text-yellow-500",
      button: "bg-yellow-600 hover:bg-yellow-700 text-white",
    },
    default: {
      icon: "bg-gold/20",
      iconColor: "text-gold",
      button: "",
    },
  };

  const styles = variantStyles[variant];

  const content = (
    <div
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 p-4"
    >
      <div
        className="bg-luxury-secondary border-border animate-in fade-in zoom-in-95 w-full max-w-sm rounded-2xl border p-6 shadow-xl duration-200"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
      >
        {icon && (
          <div className={cn("mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full", styles.icon)}>
            <span className={styles.iconColor}>{icon}</span>
          </div>
        )}

        <h2 id="confirm-title" className="text-ivory mb-2 text-center text-lg font-semibold">
          {title}
        </h2>

        <p id="confirm-description" className="text-muted-gray mb-6 text-center text-sm">
          {description}
        </p>

        <div className="flex gap-3">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant === "default" ? "gold" : "ghost"}
            className={cn("flex-1", variant !== "default" && styles.button)}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "처리 중..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

interface UseConfirmDialogOptions {
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
  icon?: ReactNode;
}

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<UseConfirmDialogOptions | null>(null);
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: UseConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(opts);
      setResolveRef(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    resolveRef?.(false);
  }, [resolveRef]);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    resolveRef?.(true);
  }, [resolveRef]);

  const ConfirmDialogComponent = options ? (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={options.title}
      description={options.description}
      confirmText={options.confirmText}
      cancelText={options.cancelText}
      variant={options.variant}
      icon={options.icon}
    />
  ) : null;

  return { confirm, ConfirmDialog: ConfirmDialogComponent };
}
