'use client'

import Nav from "@/src/components/NavBar";
import { Toaster } from "react-hot-toast";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Toaster position="top-center" />
    </>
  );
}