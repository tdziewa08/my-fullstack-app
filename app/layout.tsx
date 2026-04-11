import type { Metadata } from "next";
// @ts-ignore
import "./globals.css";
import Navigation, { NavigationFallback } from '@/components/Navigation'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: "My App",
  description: "My custom application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
        <link href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Suspense fallback={<NavigationFallback />}>
          <Navigation />
        </Suspense>
        {children}
      </body>
    </html>
  );
}