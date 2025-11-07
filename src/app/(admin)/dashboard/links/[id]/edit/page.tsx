import Link from "next/link";
import { Suspense } from "react";
import { getLinkById } from "@/actions/links";
import { LinkForm } from "@/components/links/link-form";

interface EditLinkPageProps {
  params: Promise<{ id: string }>;
}

const EditLinkContent = async ({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>;
}) => {
  const { id } = await paramsPromise;
  const link = await getLinkById(id);

  return (
    <div className="rounded-lg border bg-card p-6">
      <LinkForm
        mode="edit"
        defaultValues={{
          id: link.id,
          slug: link.slug,
          title: link.title,
          url: link.url,
          icon: link.icon ?? undefined,
          description: link.description ?? undefined,
          category: link.category as
            | "social"
            | "projects"
            | "contact"
            | "other"
            | undefined,
          isActive: link.isActive ?? true,
          startDate: link.startDate ?? undefined,
          endDate: link.endDate ?? undefined,
        }}
      />
    </div>
  );
};

const EditLinkPage = ({ params }: EditLinkPageProps) => {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/links"
          className="text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Link>
        <h1 className="text-3xl font-bold">Edit Link</h1>
      </div>

      <Suspense fallback={null}>
        <EditLinkContent paramsPromise={params} />
      </Suspense>
    </div>
  );
};

export default EditLinkPage;
