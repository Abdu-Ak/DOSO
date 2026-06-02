export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://darulhidayadars.com";

  const routes = [
    "",
    "/about",
    "/alumni",
    "/contact",
    "/events",
    "/register/alumni",
    "/register/student",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  return routes;
}
