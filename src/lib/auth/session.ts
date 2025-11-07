import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Gets the current authenticated user's ID from the session.
 * Must be called from Server Components or Server Actions.
 *
 * @throws {Error} If the user is not authenticated
 * @returns {Promise<string>} The authenticated user's ID
 */
export const getCurrentUserId = async (): Promise<string> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
};

/**
 * Gets the current session or null if not authenticated.
 * Must be called from Server Components or Server Actions.
 *
 * @returns {Promise<Session | null>} The session object or null
 */
export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
};
