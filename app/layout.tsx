import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Club App",
  description: "クラブ会員管理アプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col bg-white">
        <Providers>
          <div className="flex-1 flex flex-col pb-16">
            {children}
          </div>
          <Nav />
        </Providers>
      </body>
    </html>
  );
}
