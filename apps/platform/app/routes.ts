import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/signed-in.tsx", [
    layout("layouts/page-boundary.tsx", [
      index("routes/home.tsx"),
      route("projects", "routes/projects.tsx"),
      route("dev/tokens", "routes/dev-tokens.tsx"),
      route("profile", "routes/profile.tsx"),
      route("dev/errors", "routes/dev-errors.tsx"),
      route("*", "routes/not-found.tsx"),
    ]),
  ]),
  route("projects/:id/edit", "routes/project-editor.tsx"),
] satisfies RouteConfig;
