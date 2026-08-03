import { BillingOptions } from "@/app/user/components/BillingOptions"

export const metadata = {
  title: "Pricing | Mockrithm",
  description: "Manage your Mockrithm subscription and upgrade your tier.",
}

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-wider font-mona-sans">Manage Subscription</h1>
        <p className="text-sm text-zinc-400 mt-1">Upgrade your tier to unlock more features, or manage your existing subscription.</p>
      </div>
      <BillingOptions />
    </div>
  )
}
