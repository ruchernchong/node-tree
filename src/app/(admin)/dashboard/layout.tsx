import Link from "next/link";
import type { ReactNode } from "react";

const DashboardLayout = async ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="flex h-16 items-center px-4 gap-4">
          <Link href="/dashboard" className="font-bold text-xl">
            nodetree.link
          </Link>

          <nav className="flex gap-6 ml-8">
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/links"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Links
            </Link>
            <Link
              href="/dashboard/analytics"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Analytics
            </Link>
            <Link
              href="/dashboard/profile"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Profile
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <form action="/api/auth/sign-out" method="POST">
              <button
                type="submit"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
