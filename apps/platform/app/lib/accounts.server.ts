import { apiGetRequest } from "./api.server";

export type Profile = {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  preferences: { theme: "system" | "dark" | "light" };
  createdAt: string;
  updatedAt: string;
};

export async function getProfile(): Promise<Profile> {
  return await apiGetRequest<Profile>("/accounts/me");
}
