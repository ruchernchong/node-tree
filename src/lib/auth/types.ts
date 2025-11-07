import type { auth } from "@/lib/auth";

/**
 * Better Auth Session type
 * Inferred from the auth instance
 */
export type Session = Awaited<
	ReturnType<typeof auth.api.getSession>
>;

/**
 * Better Auth User type
 * Extracted from the session
 */
export type User = NonNullable<Session>["user"];

/**
 * Better Auth Session with guaranteed user
 * Used in authenticated contexts
 */
export type AuthenticatedSession = Session & {
	user: User;
};
