"use server";

import { headers } from "next/headers";
import { forbidden, unauthorized } from "next/navigation";
import { cache } from "react";
import { auth } from "@/lib/auth";

/**
 * Get the current session using Better Auth
 * Returns null if no session exists
 */
export const getSession = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
};

/**
 * Verify session exists and return it
 * Throws unauthorized() if no valid session (Next.js 16 pattern)
 * Uses React cache for memoization across the request
 */
export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session?.user) {
    unauthorized();
  }

  return session;
});

/**
 * Require authentication for a server component or action
 * Throws unauthorized() if not authenticated (Next.js 16 pattern)
 * @returns The authenticated session
 */
export const requireAuth = async () => {
  return await verifySession();
};

/**
 * Check if the current user is the Phase 1 admin
 * @param userId - User ID to check
 * @returns true if user is admin
 */
export const isAdmin = (userId: string): boolean => {
  const adminUserId = process.env.ADMIN_USER_ID;

  if (!adminUserId) {
    console.warn(
      "ADMIN_USER_ID not set - Phase 1 admin check will always fail",
    );
    return false;
  }

  return userId === adminUserId;
};

/**
 * Require admin role for a server component or action
 * Phase 1: Checks against ADMIN_USER_ID environment variable
 * Throws forbidden() if not admin (Next.js 16 pattern)
 * @returns The authenticated admin session
 */
export const requireAdmin = async () => {
  const session = await verifySession();

  if (!isAdmin(session.user.id)) {
    forbidden();
  }

  return session;
};

/**
 * Get user ID from session, or null if not authenticated
 */
export const getUserId = async (): Promise<string | null> => {
  const session = await getSession();
  return session?.user?.id ?? null;
};

/**
 * Check if the current request is from an authenticated user
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const session = await getSession();
  return !!session?.user;
};
