import Header from "./Header";
import { ReactNode } from "react";
import Navbar from "./NavBar";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <Header />
      <Navbar />
      <main className="ml-64 pt-16 p-8 bg-gray-50 min-h-screen">
        {children}
      </main>
    </>
  );
}
