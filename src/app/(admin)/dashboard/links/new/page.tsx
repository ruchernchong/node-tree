import Link from "next/link";
import { Suspense } from "react";
import { LinkForm } from "@/components/links/link-form";

const NewLinkPage = () => {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/links"
          className="text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Link>
        <h1 className="text-3xl font-bold">Create New Link</h1>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <Suspense fallback={null}>
          <LinkForm mode="create" />
        </Suspense>
      </div>
    </div>
  );
};

export default NewLinkPage;
