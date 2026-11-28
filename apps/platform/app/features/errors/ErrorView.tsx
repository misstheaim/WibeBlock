import { Link, useRevalidator } from "react-router";
import { errorViewStyles } from "./errorStyles";
import { Button, buttonVariants } from "@wibeblock/ui";

export function ErrorView({
  title,
  message,
  canRetry,
  details,
}: {
  title: string;
  message: string;
  canRetry?: boolean;
  details?: string;
}) {
  const { revalidate, state } = useRevalidator();

  return (
    <div role="alert" className={errorViewStyles.root}>
      <h1 className={errorViewStyles.title}>{title}</h1>
      <p className={errorViewStyles.message}>{message}</p>
      <div className={errorViewStyles.actions}>
        {canRetry && (
          <Button
            intent="primary"
            onClick={() => revalidate()}
            loading={state === "loading"}
          >
            Try again
          </Button>
        )}
        <Link to="/" className={buttonVariants({ intent: "ghost" })}>
          Go home
        </Link>
      </div>
      {import.meta.env.DEV && details && (
        <pre className={errorViewStyles.details}>
          <code>{details}</code>
        </pre>
      )}
    </div>
  );
}
