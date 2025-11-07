"use server";

import { asc, eq } from "drizzle-orm";
import { cacheLife } from "next/cache";
import { db } from "@/db";
import { link, profileSettings, users } from "@/db/schema";

/**
 * Get a user by their username
 * @param username - The normalized username to look up
 * @returns User object or null if not found
 */
export const getUserByUsername = async (username: string) => {
  "use cache";
  cacheLife("minutes");

  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      username: users.username,
      displayUsername: users.displayUsername,
    })
    .from(users)
    .where(eq(users.username, username.toLowerCase()))
    .limit(1);

  return user ?? null;
};

/**
 * Get public profile settings for a user
 * @param userId - The user ID to fetch profile for
 * @returns Profile settings or null if not found
 */
export const getPublicProfile = async (userId: string) => {
  "use cache";
  cacheLife("minutes");

  const [profile] = await db
    .select({
      displayName: profileSettings.displayName,
      bio: profileSettings.bio,
      theme: profileSettings.theme,
    })
    .from(profileSettings)
    .where(eq(profileSettings.userId, userId))
    .limit(1);

  return profile ?? null;
};

/**
 * Check if a link is currently visible based on scheduling
 * @param link - The link object to check
 * @returns True if the link should be displayed
 */
const isLinkVisible = (linkData: {
  isActive: boolean | null;
  startDate: Date | null;
  endDate: Date | null;
}) => {
  if (!linkData.isActive) return false;

  const now = new Date();

  if (linkData.startDate && now < new Date(linkData.startDate)) {
    return false;
  }

  if (linkData.endDate && now > new Date(linkData.endDate)) {
    return false;
  }

  return true;
};

/**
 * Get all visible links for a user's public profile
 * Filters by isActive and scheduling (startDate/endDate)
 * @param userId - The user ID to fetch links for
 * @returns Array of visible links ordered by order field
 */
export const getPublicLinks = async (userId: string) => {
  "use cache";
  cacheLife("minutes");

  const links = await db
    .select({
      id: link.id,
      slug: link.slug,
      title: link.title,
      url: link.url,
      icon: link.icon,
      description: link.description,
      category: link.category,
      isActive: link.isActive,
      startDate: link.startDate,
      endDate: link.endDate,
      order: link.order,
    })
    .from(link)
    .where(eq(link.userId, userId))
    .orderBy(asc(link.order));

  // Filter for visible links based on scheduling
  return links.filter(isLinkVisible);
};
