// Mock data for the mocked backend (P-08 US-2, D-33).
// The types are hand-written and kept small on purpose: P-19 US-6 replaces
// them with types generated from the Core API's OpenAPI document.

export type ThemePreference = "light" | "dark" | "system";

/** `GET /accounts/me`: the signed-in user's profile (Core API, Accounts module, P-19). */
export type Profile = {
  id: string;
  displayName: string;
  email: string;
  /** Picture from the sign-in provider; `null` means "show initials". */
  avatarUrl: string | null;
  preferences: { theme: ThemePreference };
  /** ISO 8601 date-time. */
  createdAt: string;
  /** ISO 8601 date-time. */
  updatedAt: string;
};

export const mockProfile: Profile = {
  id: "8f6d1c2e-4b7a-4e0f-9a3d-2c5b7e1f0a91",
  displayName: "Mock User",
  email: "mock.user@example.com",
  avatarUrl: null,
  preferences: { theme: "system" },
  createdAt: "2026-10-30T09:15:00Z",
  updatedAt: "2026-11-10T17:20:00Z",
};
