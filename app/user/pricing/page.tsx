import MarketingNavbar from "@/components/shared/MarketingNavbar"
import PostLoginPricing from "./PostLoginPricing"

export const metadata = {
  title: "Pricing | Mockrithm",
  description: "Manage your Mockrithm subscription and upgrade your tier.",
}

export default function PricingPage() {
  return (
    <div className="w-full flex flex-col font-mona-sans relative z-10 min-h-screen bg-zinc-950 text-white overflow-y-hidden selection:bg-white selection:text-black">
      <MarketingNavbar />
      <PostLoginPricing />
    </div>
  )
}
