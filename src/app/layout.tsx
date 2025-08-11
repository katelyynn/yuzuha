import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Heart } from 'tabler-icons-react';

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap"
});

export const metadata: Metadata = {
  title: 'avatar cropper by katelyn/claire',
  description: 'turn an image into a neatly-cropped avatar of your choosing',
  icons: {
    icon: '/icon.svg'
  },
  twitter: {
    title: 'avatar cropper by katelyn/claire',
    description: 'turn an image into a neatly-cropped avatar of your choosing'
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { color: '#110D0F' }
  ],
  authors: [
    { name: 'katelyn', url: 'https://katelyn.moe' }
  ],
  keywords: ['avatar', 'image', 'crop', 'resize', 'scale', 'profile picture', 'pfp', 'avi']
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable}`}>
        <div className="page">
          {children}
          <footer>
            made with <a href="https://katelyn.moe/sponsor" target="_blank"><Heart fill="currentColor" /></a> by katelyn/claire 2025
          </footer>
        </div>
      </body>
    </html>
  );
}
