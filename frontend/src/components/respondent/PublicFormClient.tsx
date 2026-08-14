"use client";

import { useQuery } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { RespondentFlow } from "./RespondentFlow";
import { LoaderIcon } from "@/components/ui/icons";

import { useRef } from "react";

export function PublicFormClient({ slug }: { slug: string }) {
  const responseIdRef = useRef<number | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-form", slug],
    queryFn: () => api.getPublicForm(slug),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center text-ink-soft gap-2">
        <LoaderIcon width={20} height={20} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-2xl font-semibold text-ink mb-2">This form isn&apos;t available</h1>
        <p className="text-ink-soft">It may be unpublished, or the link might be incorrect.</p>
      </div>
    );
  }

  return (
    <RespondentFlow
      form={data}
      mode="public"
      onProgress={async (answers) => {
        try {
          const res = await api.saveResponseProgress(slug, {
            response_id: responseIdRef.current,
            answers,
          });
          if (res && res.id) {
            responseIdRef.current = res.id;
          }
        } catch {
          // Silent background save
        }
      }}
      onSubmit={async (answers) => {
        try {
          await api.submitResponse(slug, answers, true, responseIdRef.current);
        } catch (err) {
          if (err instanceof ApiError && err.status === 422) {
            const errors = (err.payload as { detail?: { errors?: { message: string }[] } })?.detail?.errors;
            throw new Error(errors?.[0]?.message ?? "Please check your answers and try again.");
          }
          throw err;
        }
      }}
    />
  );
}
