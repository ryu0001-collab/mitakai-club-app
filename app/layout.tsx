import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "三田会アプリ",
  description: "クラブ会員管理アプリ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "三田会アプリ",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-180.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-180.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        <Providers>
          <div className="flex-1 flex flex-col pb-24">
            {children}
          </div>
          <Nav />
        </Providers>
      </body>
    </html>
  );
}
