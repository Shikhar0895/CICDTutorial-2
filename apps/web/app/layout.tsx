import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} p-[64px] relative`}
      >
        {/* <div className="absolute min-h-screen top-[50%] left-0 text-9xl font-bold -z-10 backdrop-blur-3xl bg-amber-500 rounded-4xl blur-3xl">
          Articulate
        </div> */}
        <div className="absolute z-50">{children}</div>
      </body>
    </html>
  );
}
