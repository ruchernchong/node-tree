"use server";

import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { link } from "@/db/schema";
import { type LinkFormData, linkSchema } from "@/lib/schemas/link";

// Hardcoded user ID for all operations
const HARDCODED_USER_ID = "temp-user-id";

export const createLink = async (data: LinkFormData) => {
  // Validate input
  const validated = linkSchema.parse(data);

  // Check if slug already exists for this user
  const existing = await db
    .select()
    .from(link)
    .where(
      and(eq(link.userId, HARDCODED_USER_ID), eq(link.slug, validated.slug)),
    )
    .limit(1);

  if (existing.length > 0) {
    throw new Error("A link with this slug already exists");
  }

  // Get the highest order number
  const maxOrder = await db
    .select({ order: link.order })
    .from(link)
    .where(eq(link.userId, HARDCODED_USER_ID))
    .orderBy(desc(link.order))
    .limit(1);

  const newOrder = maxOrder.length > 0 ? (maxOrder[0].order ?? 0) + 1 : 0;

  // Create link
  const [newLink] = await db
    .insert(link)
    .values({
      id: nanoid(),
      userId: HARDCODED_USER_ID,
      slug: validated.slug,
      title: validated.title,
      url: validated.url,
      icon: validated.icon,
      description: validated.description,
      category: validated.category,
      isActive: validated.isActive,
      startDate: validated.startDate,
      endDate: validated.endDate,
      order: newOrder,
    })
    .returning();

  revalidatePath("/dashboard/links");
  return newLink;
};

export const updateLink = async (id: string, data: LinkFormData) => {
  // Validate input
  const validated = linkSchema.parse(data);

  // Check if link exists and belongs to user
  const existing = await db
    .select()
    .from(link)
    .where(and(eq(link.id, id), eq(link.userId, HARDCODED_USER_ID)))
    .limit(1);

  if (existing.length === 0) {
    throw new Error("Link not found");
  }

  // Check if slug is being changed and if it already exists
  if (existing[0].slug !== validated.slug) {
    const slugExists = await db
      .select()
      .from(link)
      .where(
        and(eq(link.userId, HARDCODED_USER_ID), eq(link.slug, validated.slug)),
      )
      .limit(1);

    if (slugExists.length > 0) {
      throw new Error("A link with this slug already exists");
    }
  }

  // Update link
  const [updatedLink] = await db
    .update(link)
    .set({
      slug: validated.slug,
      title: validated.title,
      url: validated.url,
      icon: validated.icon,
      description: validated.description,
      category: validated.category,
      isActive: validated.isActive,
      startDate: validated.startDate,
      endDate: validated.endDate,
    })
    .where(and(eq(link.id, id), eq(link.userId, HARDCODED_USER_ID)))
    .returning();

  revalidatePath("/dashboard/links");
  revalidatePath(`/dashboard/links/${id}/edit`);
  return updatedLink;
};

export const deleteLink = async (id: string) => {
  // Delete link
  const [deleted] = await db
    .delete(link)
    .where(and(eq(link.id, id), eq(link.userId, HARDCODED_USER_ID)))
    .returning();

  if (!deleted) {
    throw new Error("Link not found");
  }

  revalidatePath("/dashboard/links");
  return { success: true };
};

export const getLinks = async () => {
  const links = await db
    .select()
    .from(link)
    .where(eq(link.userId, HARDCODED_USER_ID))
    .orderBy(link.order);

  return links;
};

export const getLinkById = async (id: string) => {
  const [foundLink] = await db
    .select()
    .from(link)
    .where(and(eq(link.id, id), eq(link.userId, HARDCODED_USER_ID)))
    .limit(1);

  if (!foundLink) {
    throw new Error("Link not found");
  }

  return foundLink;
};

export const toggleLinkActive = async (id: string) => {
  // Get current link
  const [currentLink] = await db
    .select()
    .from(link)
    .where(and(eq(link.id, id), eq(link.userId, HARDCODED_USER_ID)))
    .limit(1);

  if (!currentLink) {
    throw new Error("Link not found");
  }

  // Toggle active status
  const [updatedLink] = await db
    .update(link)
    .set({ isActive: !currentLink.isActive })
    .where(and(eq(link.id, id), eq(link.userId, HARDCODED_USER_ID)))
    .returning();

  revalidatePath("/dashboard/links");
  return updatedLink;
};

export const reorderLinks = async (linkIds: string[]) => {
  // Update order for each link
  await Promise.all(
    linkIds.map((linkId, index) =>
      db
        .update(link)
        .set({ order: index })
        .where(and(eq(link.id, linkId), eq(link.userId, HARDCODED_USER_ID))),
    ),
  );

  revalidatePath("/dashboard/links");
  return { success: true };
};
