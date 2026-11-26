import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Skeleton,
  toast,
} from "@wibeblock/ui";
import type { Route } from "./+types/profile";
import {
  getProfile,
  updateProfile,
  type Profile as ProfileData,
} from "~/lib/accounts.server";
import { Suspense, useEffect } from "react";
import { Await, data, useAsyncError, useRevalidator } from "react-router";
import { ProfileForm, profileUpdateSchema } from "~/features/account";
import * as z from "zod";
import { ApiError } from "~/lib/api.server";

export function meta() {
  return [{ title: "Profile - WibeBlock" }];
}

export function loader() {
  const profile = getProfile();
  return { profile };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("displayName");
  const result = profileUpdateSchema.safeParse({ displayName: name });
  if (!result.success) {
    return data(
      {
        ok: false as const,
        fieldErrors: z.flattenError(result.error).fieldErrors,
      },
      { status: 400 },
    );
  } else {
    try {
      await updateProfile(result.data);
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === 400 &&
        error.problem?.errors
      ) {
        return data(
          { ok: false as const, fieldErrors: error.problem.errors },
          { status: 400 },
        );
      } else {
        throw error;
      }
    }
    return { ok: true as const };
  }
}

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export default function Profile({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  useEffect(() => {
    if (actionData?.ok)
      toast({ title: "Display name saved!", tone: "success" });
  }, [actionData]);
  const error =
    actionData?.ok === false
      ? actionData.fieldErrors.displayName?.[0]
      : undefined;
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 p-8">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <Suspense fallback={<ProfileSkeleton />}>
        <Await resolve={loaderData.profile} errorElement={<ProfileError />}>
          {(profile) => (
            <>
              <ProfileDetails profile={profile} />
              <ProfileForm
                key={profile.updatedAt}
                profile={profile}
                error={error}
              />
            </>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

function ProfileDetails({ profile }: { profile: ProfileData }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar size="lg">
        <AvatarImage src={profile.avatarUrl ?? undefined} />
        <AvatarFallback name={profile.displayName} />
      </Avatar>
      <div className="flex flex-col gap-0.5">
        <p className="text-lg font-medium">{profile.displayName}</p>
        <p className="text-sm text-muted-foreground">{profile.email}</p>
        <p className="text-sm text-muted-foreground">
          Member since {formatter.format(new Date(profile.createdAt))}
        </p>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-4" aria-busy="true">
      <span className="sr-only">Loading profile…</span>
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
  );
}

function ProfileError() {
  const { revalidate, state } = useRevalidator();
  const error = useAsyncError();
  console.error(error);

  return (
    <div
      className="flex flex-col items-start gap-3 rounded-lg border border-border p-4"
      role="alert"
    >
      <p className="text-sm text-muted-foreground">
        We couldn't load your profile(
      </p>
      <Button
        intent="secondary"
        onClick={() => revalidate()}
        loading={state === "loading"}
      >
        Try again
      </Button>
    </div>
  );
}
