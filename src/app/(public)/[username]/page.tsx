import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  getPublicLinks,
  getPublicProfile,
  getUserByUsername,
} from "@/actions/public-profile";
import { LinkCard } from "../_components/link-card";
import { ProfileHeader } from "../_components/profile-header";

interface PageProps {
  params: Promise<{ username: string }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) {
    return {
      title: "User Not Found",
    };
  }

  const profile = await getPublicProfile(user.id);
  const displayName = profile?.displayName ?? user.name;
  const bio = profile?.bio;

  return {
    title: `${displayName} | nodetree.link`,
    description: bio ?? `Visit ${displayName}'s links`,
    openGraph: {
      title: displayName,
      description: bio ?? `Visit ${displayName}'s links`,
      images: user.image ? [user.image] : undefined,
      url: `https://nodetree.link/${username}`,
    },
    twitter: {
      card: "summary",
      title: displayName,
      description: bio ?? `Visit ${displayName}'s links`,
      images: user.image ? [user.image] : undefined,
    },
  };
};

const ProfileContent = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) {
    notFound();
  }

  const profile = await getPublicProfile(user.id);
  const links = await getPublicLinks(user.id);

  const displayName = profile?.displayName ?? user.name;
  const bio = profile?.bio ?? null;
  const theme = profile?.theme ?? "dark";

  return (
    <div className={theme === "light" ? "" : "dark"}>
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="flex flex-col gap-8">
            <ProfileHeader
              displayUsername={user.displayUsername}
              displayName={displayName}
              bio={bio}
              image={user.image}
            />

            <div className="flex flex-col gap-3">
              {links.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No links available yet
                </p>
              ) : (
                links.map((link) => {
                  return (
                    <LinkCard
                      key={link.id}
                      slug={link.slug}
                      title={link.title}
                      url={link.url}
                      icon={link.icon}
                      description={link.description}
                      category={link.category}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const UsernamePage = ({ params }: PageProps) => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProfileContent params={params} />
    </Suspense>
  );
};

export default UsernamePage;
