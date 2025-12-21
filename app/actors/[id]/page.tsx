import { ActorDetailContent } from "./_components/ActorDetailContent";

interface ActorDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ActorDetailPage({ params }: ActorDetailPageProps) {
  const { id } = await params;
  return <ActorDetailContent actorId={id} />;
}
