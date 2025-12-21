import { Suspense } from "react";
import { CharacterAddForm } from "../_components/CharacterAddForm";

export default function CharacterAddPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CharacterAddForm />
    </Suspense>
  );
}
