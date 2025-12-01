import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notes — Capture Your Thoughts",
  description: "A beautiful, modern note-taking app for capturing your thoughts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
