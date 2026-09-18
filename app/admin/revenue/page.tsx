"use client";

import { useEffect, useState, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Users,
  Search,
  RefreshCw,
  Crown,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Calendar
} from "lucide-react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminRevenuePage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("all");

  const fetchRevenueData = async () => {
    try {
      const { getAdminRevenueData } = await import("@/lib/actions/admin.action");
      const res = await getAdminRevenueData();
      if (res.success && res.data) {
        setRevenueData(res.data);
      } else {
        toast.error(res.error || "Failed to load revenue analytics.");
      }
    } catch (err) {
      console.error("Failed to fetch revenue analytics:", err);
      toast.error("An error occurred while fetching revenue data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        ".revenue-card",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, [loading]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRevenueData();
  };

  const filteredSubscribers = useMemo(() => {
    if (!revenueData?.subscribers) return [];
    return revenueData.subscribers.filter((sub: any) => {
      const matchesSearch =
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlan =
        planFilter === "all" || sub.tier.toLowerCase() === planFilter.toLowerCase();
      return matchesSearch && matchesPlan;
    });
  }, [revenueData, searchTerm, planFilter]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 font-sans flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-emerald-400" />
            Revenue & Subscriptions
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Monitor recurring revenue, paid subscriber growth, and transaction history across Pro and Premium plans.
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          variant="outline"
          className="border-white/10 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card className="revenue-card bg-zinc-950 border border-white/5 shadow-none overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-500">
            <DollarSign className="h-16 w-16" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Total Estimated Revenue
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-28 bg-zinc-900 mt-1" />
            ) : (
              <div>
                <div className="text-3xl font-bold text-zinc-100">
                  ${revenueData?.totalRevenue?.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                  <ArrowUpRight className="h-3 w-3" /> Cumulative lifetime value
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* MRR */}
        <Card className="revenue-card bg-zinc-950 border border-white/5 shadow-none overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-500">
            <TrendingUp className="h-16 w-16" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Monthly Recurring Revenue (MRR)
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-28 bg-zinc-900 mt-1" />
            ) : (
              <div>
                <div className="text-3xl font-bold text-zinc-100">
                  ${revenueData?.mrr?.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-indigo-400 mt-1 font-medium">
                  Normalized monthly recurring income
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paid Subscribers */}
        <Card className="revenue-card bg-zinc-950 border border-white/5 shadow-none overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500">
            <Crown className="h-16 w-16" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Paid Subscribers
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Crown className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-28 bg-zinc-900 mt-1" />
            ) : (
              <div>
                <div className="text-3xl font-bold text-zinc-100">
                  {revenueData?.totalPaidUsers || 0}
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Out of {revenueData?.totalUsers || 0} total registered users
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ARPU */}
        <Card className="revenue-card bg-zinc-950 border border-white/5 shadow-none overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-purple-500">
            <CreditCard className="h-16 w-16" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              ARPU (Avg. per Paid User)
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <CreditCard className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-28 bg-zinc-900 mt-1" />
            ) : (
              <div>
                <div className="text-3xl font-bold text-zinc-100">
                  ${revenueData?.arpu || "0.00"}
                </div>
                <p className="text-xs text-purple-400 mt-1 font-medium">
                  Average spend per paying customer
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Plan Breakdown Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Pro Plan Card */}
        <Card className="revenue-card bg-zinc-950 border border-amber-500/20 shadow-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-6 -mt-6" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs px-2.5 py-0.5 font-bold uppercase tracking-wider">
                Pro Tier
              </Badge>
              <Zap className="h-5 w-5 text-amber-400" />
            </div>
            <CardTitle className="text-xl font-bold text-zinc-100 mt-2">$30 / month</CardTitle>
            <CardDescription className="text-zinc-400 text-xs">
              Full access, unlimited mock interviews, ATS resume optimization.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 border-t border-white/5 pt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">Active Subscribers</span>
              <span className="font-bold text-zinc-100">{loading ? "..." : revenueData?.proCount || 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">Estimated Pro Revenue</span>
              <span className="font-bold text-amber-400">
                ${loading ? "..." : (revenueData?.proRevenue || 0).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Premium Plan Card */}
        <Card className="revenue-card bg-zinc-950 border border-emerald-500/20 shadow-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-6 -mt-6" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs px-2.5 py-0.5 font-bold uppercase tracking-wider">
                Premium Tier
              </Badge>
              <Crown className="h-5 w-5 text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-bold text-zinc-100 mt-2">$15 / month</CardTitle>
            <CardDescription className="text-zinc-400 text-xs">
              Essential voice sessions and detailed candidate feedback reports.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 border-t border-white/5 pt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">Active Subscribers</span>
              <span className="font-bold text-zinc-100">{loading ? "..." : revenueData?.premiumCount || 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">Estimated Premium Revenue</span>
              <span className="font-bold text-emerald-400">
                ${loading ? "..." : (revenueData?.premiumRevenue || 0).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Free Plan Card */}
        <Card className="revenue-card bg-zinc-950 border border-white/5 shadow-none relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-zinc-900 text-zinc-400 border-zinc-700 text-xs px-2.5 py-0.5 font-bold uppercase tracking-wider">
                Free Tier
              </Badge>
              <Users className="h-5 w-5 text-zinc-500" />
            </div>
            <CardTitle className="text-xl font-bold text-zinc-100 mt-2">$0 / month</CardTitle>
            <CardDescription className="text-zinc-400 text-xs">
              Free trial users and standard accounts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 border-t border-white/5 pt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">Free Accounts</span>
              <span className="font-bold text-zinc-100">{loading ? "..." : revenueData?.freeCount || 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">Paid Conversion Rate</span>
              <span className="font-bold text-indigo-400">
                {loading
                  ? "..."
                  : revenueData?.totalUsers > 0
                  ? `${((revenueData.totalPaidUsers / revenueData.totalUsers) * 100).toFixed(1)}%`
                  : "0%"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Paid Subscribers Table */}
      <Card className="revenue-card bg-zinc-950 border border-white/5 shadow-none overflow-hidden">
        <CardHeader className="border-b border-white/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Paid Subscribers & Subscription Records
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs mt-1">
                Detailed list of users who have purchased a Pro or Premium subscription plan.
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 self-start sm:self-auto">
              {filteredSubscribers.length} Paid Record{filteredSubscribers.length === 1 ? "" : "s"}
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search paying subscribers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-zinc-900/30 border-white/5 text-zinc-100 placeholder:text-zinc-500 focus:border-white/20 rounded-md"
              />
            </div>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-zinc-900/30 border-white/5 text-zinc-200">
                <SelectValue placeholder="All Paid Plans" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/5 text-zinc-200">
                <SelectItem value="all">All Paid Plans</SelectItem>
                <SelectItem value="pro">Pro Plan ($30)</SelectItem>
                <SelectItem value="premium">Premium Plan ($15)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/5 hover:bg-transparent">
                  <TableHead className="text-zinc-400 font-medium">Subscriber</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Email</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Subscription Plan</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Billing Interval</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Subscription Updated</TableHead>
                  <TableHead className="text-zinc-400 font-medium text-right pr-6">Amount Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <TableRow key={idx} className="border-b border-white/5">
                      <TableCell><Skeleton className="h-4 w-32 bg-zinc-900" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40 bg-zinc-900" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20 bg-zinc-900" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16 bg-zinc-900" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24 bg-zinc-900" /></TableCell>
                      <TableCell className="text-right pr-6"><Skeleton className="h-4 w-16 ml-auto bg-zinc-900" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredSubscribers.length > 0 ? (
                  filteredSubscribers.map((sub: any) => (
                    <TableRow
                      key={sub.id}
                      className="border-b border-white/5 hover:bg-zinc-900/30 transition-colors"
                    >
                      <TableCell className="font-medium text-zinc-100 flex items-center gap-2">
                        <span>{sub.name}</span>
                        {sub.tier === "Pro" ? (
                          <Badge className="bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border-amber-500/30 text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider">
                            PRO
                          </Badge>
                        ) : (
                          <Badge className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30 text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider">
                            PREMIUM
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-zinc-400">{sub.email}</TableCell>
                      <TableCell>
                        <span className="text-xs font-semibold text-zinc-200">
                          {sub.tier} Subscription
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-zinc-900 text-zinc-300 border-white/10 capitalize text-xs">
                          {sub.billingInterval}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                          <span>
                            {sub.subscriptionUpdatedAt
                              ? new Date(sub.subscriptionUpdatedAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6 font-bold text-emerald-400 text-sm">
                        ${sub.amount}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-zinc-500 text-sm">
                      No paid subscribers found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
