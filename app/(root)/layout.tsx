import { ReactNode } from "react";
import { headers } from "next/headers";

const Layout = async ({ children }: { children: ReactNode }) => {
  const headerList = await headers();
  const host = headerList.get("host") || "";

  if (host.startsWith("docs.")) {
    return <>{children}</>;
  }

  return (
    <div className="root-layout">
      {children}
    </div>
  );
};

export default Layout;
