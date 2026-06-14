"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "./Footer";

const FooterWrapper = () => {
  const pathname = usePathname();
  const [isDocsSubdomain, setIsDocsSubdomain] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.hostname.startsWith("docs.")) {
        setIsDocsSubdomain(true);
      }
    }
  }, []);

  if (isDocsSubdomain || pathname !== "/") return null;

  return <Footer />;
};

export default FooterWrapper;
