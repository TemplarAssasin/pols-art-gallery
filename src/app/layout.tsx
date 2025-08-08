import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS manually
config.autoAddCss = false // Prevent automatic addition of CSS


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Pol's Art Gallery",
  description: "Gallery for showcasing artworks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" className={poppins.variable}>
      <body
        className={`antialiased`}
      >
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
