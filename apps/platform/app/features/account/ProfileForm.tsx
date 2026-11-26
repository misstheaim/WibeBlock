import { Form, useNavigation } from "react-router";
import { profileFormStyles } from "./accountStyles";
import { Button, FormField, Input } from "@wibeblock/ui";
import type { Profile } from "~/lib/accounts.server";
import { useState, type SubmitEvent } from "react";
import { profileUpdateSchema } from "./profileSchema";
import * as z from "zod";

export function ProfileForm({
  profile,
  error,
}: {
  profile: Profile;
  error?: string;
}) {
  const navigation = useNavigation();
  const [clientError, setClientError] = useState<string>();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const result = profileUpdateSchema.safeParse({
      displayName: formData.get("displayName"),
    });
    if (!result.success) {
      event.preventDefault();
      setClientError(z.flattenError(result.error).fieldErrors.displayName?.[0]);
    } else {
      setClientError(undefined);
    }
  }

  return (
    <Form
      method="post"
      onSubmit={handleSubmit}
      className={profileFormStyles.form}
    >
      <FormField
        className={profileFormStyles.field}
        label="Display name"
        error={clientError ?? error}
      >
        <Input
          name="displayName"
          defaultValue={profile.displayName}
          required
          maxLength={50}
          autoComplete="nickname"
        ></Input>
      </FormField>
      <Button type="submit" loading={navigation.state === "submitting"}>
        Save
      </Button>
    </Form>
  );
}
