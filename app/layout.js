import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Darul Hidaya Dars - Preserving Heritage, Enlightening Minds",
  description:
    "A center for Islamic excellence, dedicated to nurturing the next generation of scholars and leaders.",
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
