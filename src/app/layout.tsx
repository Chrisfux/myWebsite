import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Christian Fuchs",
    default: "Christian Fuchs – Internet-Sicherheit & Webentwicklung",
  },
  description:
    "Persönliche Website von Christian Fuchs. Bachelor Medieninformatik, Master Internet-Sicherheit, wissenschaftlicher Mitarbeiter am Institut für Internet-Sicherheit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="dark">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "hsl(222 47% 14%)",
              color: "hsl(210 40% 98%)",
              border: "1px solid hsl(217 33% 18%)",
            },
          }}
        />
      </body>
    </html>
  );
}
