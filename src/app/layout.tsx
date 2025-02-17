// src/app/layout.tsx
import { Inter } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-crypto-primary`}
      >
        <SessionProvider>
          <Toaster position="top-right" reverseOrder={false} />
          {!session && <Navbar />}
          <main className="flex-1">{children}</main>
          {!session && <Footer />}
        </SessionProvider>
      </body>
    </html>
  );
}
