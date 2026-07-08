"use server";

import { auth as clerkAuth } from "@clerk/nextjs/server";

/**
 * Returns the authenticated Clerk user ID from the current session,
 * or null if not authenticated.
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
  const { userId } = await clerkAuth();
  return userId || null;
}

/**
 * Asserts that the authenticated session user matches the given userId parameter.
 * Throws if there is no session or if the IDs don't match.
 * Use this as the FIRST call in every server action that accepts a userId parameter.
 */
export async function assertOwnership(paramUserId: string): Promise<void> {
  const sessionUserId = await getAuthenticatedUserId();
  if (!sessionUserId || sessionUserId !== paramUserId) {
    throw new Error("Forbidden: session user does not match requested userId.");
  }
}
