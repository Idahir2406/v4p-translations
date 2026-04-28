import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("translation-table/:id", "routes/translationTable.tsx"),
  route("login", "routes/login-page.tsx"),
  route("translation-events", "routes/translation-events.tsx"),
] satisfies RouteConfig;
