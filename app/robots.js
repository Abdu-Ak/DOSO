export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://darulhidayadars.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/student/",
        "/alumni/debt/",
        "/alumni/profile/",
        "/alumni/sundook/",
        "/alumni/welfare/",
        "/api/",
        "/login",
        "/forgot-password",
        "/reset-password",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
