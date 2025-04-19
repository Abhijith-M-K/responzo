import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import AddBootstrap from "./AddBootstrap";
import './global.scss';
import  "bootstrap/dist/css/bootstrap.min.css";

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: "Responzo",
  description: "Responzo is a web application that helps you track your API usage and performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <AddBootstrap/>
        {children}
      </body>
    </html>
  );
}
