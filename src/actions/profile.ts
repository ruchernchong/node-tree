"use server";

import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { profileSettings, user } from "@/db/schema";
import { getCurrentUserId } from "@/lib/auth/session";
import { type ProfileFormData, profileSchema } from "@/lib/schemas/profile";

export const getOrCreateProfileSettings = async () => {
  const userId = await getCurrentUserId();

  // Try to find existing profile settings
  const [existing] = await db
    .select()
    .from(profileSettings)
    .where(eq(profileSettings.userId, userId))
    .limit(1);

  if (existing) {
    return existing;
  }

  // If no profile exists, create one with defaults
  // Get user's name from auth table
  const [currentUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!currentUser) {
    throw new Error("User not found");
  }

  // Create new profile settings with defaults
  const [newProfile] = await db
    .insert(profileSettings)
    .values({
      id: nanoid(),
      userId,
      displayName: currentUser.name,
      theme: "dark",
    })
    .returning();

  return newProfile;
};

export const updateProfileSettings = async (data: ProfileFormData) => {
  const userId = await getCurrentUserId();

  // Validate input
  const validated = profileSchema.parse(data);

  // Check if profile exists for this user
  const [existing] = await db
    .select()
    .from(profileSettings)
    .where(eq(profileSettings.userId, userId))
    .limit(1);

  if (!existing) {
    throw new Error("Profile settings not found");
  }

  // Update profile settings
  const [updated] = await db
    .update(profileSettings)
    .set({
      displayName: validated.displayName,
      bio: validated.bio || null,
      theme: validated.theme,
    })
    .where(eq(profileSettings.userId, userId))
    .returning();

  revalidatePath("/dashboard/profile");
  return updated;
};
