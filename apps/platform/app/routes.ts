import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/signed-in.tsx", [
    index("routes/home.tsx"),
    route("projects", "routes/projects.tsx"),
    route("dev/tokens", "routes/dev-tokens.tsx"),
  ]),
] satisfies RouteConfig;
