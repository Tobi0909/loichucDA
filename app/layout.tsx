import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { HER_NAME } from "@/lib/config";
import "./globals.css";

const appFont = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-app",
});

export const metadata: Metadata = {
  title: `Gửi ${HER_NAME} 💌`,
  description: `Một lời chúc nhỏ mỗi ngày dành riêng cho ${HER_NAME}.`,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffe4ef",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={appFont.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
