import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://darulhidayadars.com"),
  title: {
    default: "Darul Hidaya Dars - Islamic Educational Center",
    template: "%s | Darul Hidaya Dars",
  },
  description:
    "A center for Islamic excellence, dedicated to preserving heritage, nurturing the next generation of scholars, and enlightening minds.",
  keywords: [
    "Darul Hidaya Dars",
    "Islamic education",
    "madrasa",
    "scholars",
    "Islamic heritage",
    "Islamic portal",
    "alumni association",
    "dars",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://darulhidayadars.com",
    siteName: "Darul Hidaya Dars",
    title: "Darul Hidaya Dars - Preserving Heritage, Enlightening Minds",
    description:
      "A center for Islamic excellence dedicated to traditional knowledge and spiritual growth.",
    images: [
      {
        url: "/doso_logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Darul Hidaya Dars Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Darul Hidaya Dars",
    description:
      "A center for Islamic excellence dedicated to traditional knowledge and spiritual growth.",
    images: ["/doso_logo.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin=""
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 flex flex-col min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
