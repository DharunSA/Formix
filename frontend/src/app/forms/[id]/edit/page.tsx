import { BuilderClient } from "@/components/builder/BuilderClient";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default async function EditFormPage({ params }: PageProps<"/forms/[id]/edit">) {
  const { id } = await params;
  return (
    <AuthGuard>
      <BuilderClient formId={Number(id)} />
    </AuthGuard>
  );
}
