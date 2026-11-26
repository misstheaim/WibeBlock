import { apiRequest } from "./api.server";

export type Profile = {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  preferences: { theme: "system" | "dark" | "light" };
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileRequest = { displayName?: string };

export async function getProfile(): Promise<Profile> {
  return await apiRequest<Profile>("/accounts/me");
}

export async function updateProfile(
  update: UpdateProfileRequest,
): Promise<Profile> {
  return await apiRequest<Profile>("/accounts/me", {
    method: "PATCH",
    body: update,
  });
}
