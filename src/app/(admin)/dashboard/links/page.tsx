import Link from "next/link";
import { getLinks } from "@/actions/links";
import { SortableLinksList } from "@/components/links/sortable-links-list";

const LinksPage = async () => {
  const links = await getLinks();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Links</h1>
        <Link
          href="/dashboard/links/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Create Link
        </Link>
      </div>

      {links.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No links yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first link
          </p>
          <Link
            href="/dashboard/links/new"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create Your First Link
          </Link>
        </div>
      ) : (
        <SortableLinksList initialLinks={links} />
      )}
    </div>
  );
};

export default LinksPage;
