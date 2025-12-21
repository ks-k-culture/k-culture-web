import { Suspense } from "react";
import { CharactersContent } from "./_components/CharactersContent";

export default function CharactersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CharactersContent />
    </Suspense>
  );
}
