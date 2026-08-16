import { ResultsClient } from "@/components/results/ResultsClient";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default async function ResultsPage({ params }: PageProps<"/forms/[id]/results">) {
  const { id } = await params;
  return (
    <AuthGuard>
      <ResultsClient formId={Number(id)} />
    </AuthGuard>
  );
}
