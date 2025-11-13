import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "../styles/globals.scss";
import DevIndicatorHider from "@/components/DevIndincatorhider";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lendsqr Test",
  description: "Lendsqr User Dashboards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${workSans.variable}`}>
        <DevIndicatorHider />

        {children}
      </body>
    </html>
  );
}
