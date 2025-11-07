import { createAuthClient } from "better-auth/react";
import { passkeyClient } from "better-auth/client/plugins";
import { lastLoginMethodClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [passkeyClient(), lastLoginMethodClient()],
});
