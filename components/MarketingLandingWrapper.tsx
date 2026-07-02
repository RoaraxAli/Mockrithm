"use client";

import dynamic from "next/dynamic";

const MarketingLanding = dynamic(() => import("./MarketingLanding"), {
  ssr: false,
});

export default function MarketingLandingWrapper() {
  return <MarketingLanding />;
}
