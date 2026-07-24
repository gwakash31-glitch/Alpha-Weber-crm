import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Alpha Weber CRM",
  description:
    "Premium Business Growth Operating System for Alpha Weber.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html lang="en">

      <body>

        {children}

      </body>

    </html>

  );

}