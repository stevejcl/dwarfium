import type { ReactNode } from "react";

import Nav from "@/components/shared/Nav";
import Footer from "@/components/shared/Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="App">
      <header className="float-start w-100">
        <Nav />
      </header>
      <main className="float-start w-100 body-main ">{children}</main>
      <Footer />
    </div>
  );
}
