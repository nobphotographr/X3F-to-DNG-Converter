import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const canonical = "https://xpreview.iruagaru.com/x3f-to-dng/";
const socialImage = "https://xpreview.iruagaru.com/x3f-to-dng/og-x3f-to-dng.png?v=20260816-1";

export const metadata: Metadata = {
  metadataBase: new URL("https://xpreview.iruagaru.com"),
  title: "X3F to DNG Converter | iruagaru",
  description:
    "Sigma Merrill／QuattroのX3Fを、サーバーへ送信せずブラウザ内でLinear DNGへ変換する無料ツールです。",
  alternates: { canonical },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: "X3F to DNG Converter | iruagaru",
    description: "Foveon X3Fをサーバーへ送信せず、ブラウザの中だけでLinear DNGへ変換します。",
    url: canonical,
    siteName: "iruagaru photo tools",
    images: [{
      url: socialImage,
      secureUrl: socialImage,
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "X3F TO DNG — FOVEON, SET FREE.",
    }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "X3F to DNG Converter | iruagaru",
    description: "Foveon X3Fをサーバーへ送信せず、ブラウザの中だけでLinear DNGへ変換します。",
    images: [socialImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
