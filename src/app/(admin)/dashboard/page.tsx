import Link from "next/link";
import { getLinks } from "@/actions/links";

const DashboardPage = async () => {
  const links = await getLinks();

  // Calculate statistics
  const totalLinks = links.length;
  const activeLinks = links.filter((link) => link.isActive).length;

  // Get total clicks (we'll implement this once analytics is set up)
  // For now, return 0 as placeholder
  const totalClicks = 0;
  const clicksToday = 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link
          href="/dashboard/links/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Create New Link
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold">{totalLinks}</div>
          <p className="text-xs text-muted-foreground">Total Links</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold">{activeLinks}</div>
          <p className="text-xs text-muted-foreground">Active Links</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold">{totalClicks}</div>
          <p className="text-xs text-muted-foreground">Total Clicks</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold">{clicksToday}</div>
          <p className="text-xs text-muted-foreground">Clicks Today</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link
            href="/dashboard/links"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            View All Links
          </Link>
          <Link
            href="/dashboard/analytics"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            View Analytics
          </Link>
        </div>
      </div>

      {/* Recent Links */}
      {links.length > 0 && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Links</h2>
          <div className="flex flex-col gap-2">
            {links.slice(0, 5).map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3 rounded-md border"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{link.title}</span>
                    <span className="text-xs text-muted-foreground">
                      /{link.slug}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {link.isActive ? (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                      Active
                    </span>
                  ) : (
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      Inactive
                    </span>
                  )}
                  <Link
                    href={`/dashboard/links/${link.id}/edit`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {links.length === 0 && (
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
      )}
    </div>
  );
};

export default DashboardPage;
