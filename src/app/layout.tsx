import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { UserProvider } from "@/context/UserContext";


export const metadata: Metadata = {
  title: "PoliAlerts Dashboard",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        {/* You can also add other favicon sizes */}
        {/* <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" /> */}
        {/* <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> */}
      </head>
      <body>
        <Navbar />
        <UserProvider>
        {children}
        </UserProvider>
        <Footer />
      </body>
    </html>
  );
}
