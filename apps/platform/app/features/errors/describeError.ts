import type { ComponentProps } from "react";
import type { ErrorView } from "./ErrorView";
import { isRouteErrorResponse } from "react-router";

export function describeError(
  error: unknown,
): ComponentProps<typeof ErrorView> {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return {
      title: "Page not found",
      message: "The page you're looking for doesn't exist or has moved.",
      canRetry: false,
    };
  } else if (isRouteErrorResponse(error) && error.status === 503) {
    return {
      title: "Can't reach WibeBlock",
      message:
        "We can't reach our servers right now. Check your connection, or try again in a minute.",
      canRetry: true,
    };
  } else if (isRouteErrorResponse(error)) {
    return {
      title: "Something went wrong",
      message:
        "An unexpected error happened on our side. Try again, and if it keeps happening, come back later.",
      canRetry: true,
    };
  } else if (error instanceof Error) {
    return {
      title: "Something went wrong",
      message:
        "An unexpected error happened on our side. Try again, and if it keeps happening, come back later.",
      canRetry: true,
      details: error.stack,
    };
  } else {
    return {
      title: "Something went wrong",
      message:
        "An unexpected error happened on our side. Try again, and if it keeps happening, come back later.",
      canRetry: true,
    };
  }
}
