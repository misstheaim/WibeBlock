import { useFetchers, useNavigation } from "react-router";
import { navigationProgressStyles } from "./navigationStyles";

export function NavigationProgress() {
  const navigation = useNavigation();
  const fetchers = useFetchers();
  const busy =
    navigation.state !== "idle" ||
    fetchers.some((fetcher) => fetcher.state !== "idle");

  if (!busy) return null;

  return (
    <div
      className={navigationProgressStyles.track}
      role="progressbar"
      aria-label="Loading"
    >
      <div className={navigationProgressStyles.bar} />
    </div>
  );
}
