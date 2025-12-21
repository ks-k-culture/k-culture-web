import { FilmographyEditForm } from "../../_components/FilmographyEditForm";

interface FilmographyEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function FilmographyEditPage({ params }: FilmographyEditPageProps) {
  const { id } = await params;
  return <FilmographyEditForm filmographyId={id} />;
}
