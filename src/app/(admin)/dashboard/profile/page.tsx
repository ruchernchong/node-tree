import { Suspense } from "react";
import { getOrCreateProfileSettings } from "@/actions/profile";
import { getSession } from "@/lib/auth/session";
import { ProfileForm } from "./_components/profile-form";

const ProfileContent = async () => {
  const session = await getSession();
  const profile = await getOrCreateProfileSettings();

  if (!session?.user?.email) {
    throw new Error("Session not found");
  }

  return (
    <div className="max-w-2xl">
      <div className="rounded-lg border bg-card p-6">
        <ProfileForm
          email={session.user.email}
          defaultValues={{
            displayName: profile.displayName,
            bio: profile.bio || "",
            theme: profile.theme as "light" | "dark" | "system",
          }}
        />
      </div>
    </div>
  );
};

const ProfilePage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
      </div>

      <Suspense fallback={null}>
        <ProfileContent />
      </Suspense>
    </div>
  );
};

export default ProfilePage;
