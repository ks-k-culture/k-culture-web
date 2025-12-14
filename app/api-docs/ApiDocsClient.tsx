"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    Scalar?: unknown;
  }
}

export default function ApiDocsClient({ spec }: { spec: string }) {
  useEffect(() => {
    if (!window.Scalar) return;
    // @ts-expect-error Scalar is not typed
    window.Scalar.createApiReference("#app2", { content: spec });
  }, [spec]);

  return (
    <>
      <div id="app2" />
      <Script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference" strategy="afterInteractive" />
    </>
  );
}
