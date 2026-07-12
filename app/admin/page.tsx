"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Users,
  MessageSquare,
  Activity,
  FileText,
  DollarSign,
  ShoppingCart,
  CreditCard,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getAdminMetrics } from "@/lib/actions/admin.action";

const REVENUE_DATA = [
  { name: "Jan", thisYear: 40000, lastYear: 24000 },
  { name: "Feb", thisYear: 30000, lastYear: 1398 },
  { name: "Mar", thisYear: 20000, lastYear: 9800 },
  { name: "Apr", thisYear: 27800, lastYear: 3908 },
  { name: "May", thisYear: 18900, lastYear: 4800 },
  { name: "Jun", thisYear: 23900, lastYear: 3800 },
  { name: "Jul", thisYear: 34900, lastYear: 4300 },
  { name: "Aug", thisYear: 40000, lastYear: 24000 },
  { name: "Sep", thisYear: 30000, lastYear: 1398 },
  { name: "Oct", thisYear: 20000, lastYear: 9800 },
  { name: "Nov", thisYear: 27800, lastYear: 3908 },
  { name: "Dec", thisYear: 18900, lastYear: 4800 },
];

const CHANNEL_DATA = [
  { name: "Jan", online: 4000, store: 2400, wholesale: 2400 },
  { name: "Feb", online: 3000, store: 1398, wholesale: 2210 },
  { name: "Mar", online: 2000, store: 9800, wholesale: 2290 },
  { name: "Apr", online: 2780, store: 3908, wholesale: 2000 },
  { name: "May", online: 1890, store: 4800, wholesale: 2181 },
  { name: "Jun", online: 2390, store: 3800, wholesale: 2500 },
];

const AOV_DATA = [
  { name: "1", value: 800 },
  { name: "2", value: 1200 },
  { name: "3", value: 1000 },
  { name: "4", value: 1400 },
  { name: "5", value: 1100 },
  { name: "6", value: 1600 },
  { name: "7", value: 1300 },
  { name: "8", value: 1500 },
  { name: "9", value: 1200 },
  { name: "10", value: 1700 },
];

const CATEGORY_DATA = [
  { name: "Technical", value: 400, color: "#ffffff" },
  { name: "Behavioural", value: 300, color: "#a1a1aa" },
  { name: "Mixed", value: 300, color: "#52525b" },
];

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    users: { total: 0, change: "0" },
    feedbacks: { total: 0, change: "0" },
    sessions: { total: 0, change: "0" },
    interviews: { total: 0, change: "0" }, // Mock data
  });

  useEffect(() => {
    let isMounted = true;
    const fetchMetrics = async () => {
      try {
        const res = await getAdminMetrics();
        if (!isMounted) return;
        if (res.success && res.data) {
          setMetrics({
            users: res.data.users,
            feedbacks: res.data.feedbacks,
            sessions: res.data.sessions,
            interviews: { total: 1245, change: "+14" }, // Mock data for interviews since it's missing in getAdminMetrics
          });
        }
      } catch (err) {
        console.error("Error loading metrics:", err);
      }
    };
    fetchMetrics();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-zinc-950 text-white min-h-screen">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
      </div>

      {/* Top Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-950 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.users.total.toLocaleString()}</div>
            <p className="text-xs text-emerald-500 mt-1">
              {metrics.users.change}% vs last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Interviews Generated
            </CardTitle>
            <FileText className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.interviews.total.toLocaleString()}</div>
            <p className="text-xs text-emerald-500 mt-1">
              {metrics.interviews.change}% vs last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Feedback Submissions
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.feedbacks.total.toLocaleString()}</div>
            <p className="text-xs text-emerald-500 mt-1">
              {metrics.feedbacks.change}% vs last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Active Sessions
            </CardTitle>
            <Activity className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.sessions.total.toLocaleString()}</div>
            <p className="text-xs text-red-500 mt-1">
              {metrics.sessions.change}% vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-5 bg-zinc-950 border-white/10">
          <CardHeader>
            <CardTitle className="text-zinc-200">User Growth</CardTitle>
            <CardDescription className="text-zinc-500">
              New user registrations over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={REVENUE_DATA} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="thisYear"
                  name="This Year"
                  stroke="#ffffff"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#ffffff" }}
                />
                <Line
                  type="monotone"
                  dataKey="lastYear"
                  name="Last Year"
                  stroke="#71717a"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#71717a" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 lg:col-span-2 bg-zinc-950 border-white/10">
          <CardHeader>
            <CardTitle className="text-zinc-200">Interviews by Type</CardTitle>
            <CardDescription className="text-zinc-500">
              Technical vs Behavioural volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={CHANNEL_DATA}>
                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", color: "#fff" }}
                  cursor={{ fill: "#27272a" }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar dataKey="online" name="Technical" stackId="a" fill="#ffffff" radius={[0, 0, 4, 4]} />
                <Bar dataKey="store" name="Behavioural" stackId="a" fill="#71717a" />
                <Bar dataKey="wholesale" name="Mixed" stackId="a" fill="#3f3f46" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-zinc-950 border-white/10">
          <CardHeader>
            <CardTitle className="text-zinc-200">Daily Activity</CardTitle>
            <CardDescription className="text-zinc-500 flex items-center gap-2">
              <span className="text-emerald-500 font-medium">+2.4%</span> vs last month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={AOV_DATA}>
                <Tooltip
                  contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", color: "#fff" }}
                  cursor={{ fill: "#27272a" }}
                />
                <Bar dataKey="value" fill="#ffffff" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-white/10">
          <CardHeader>
            <CardTitle className="text-zinc-200">Average Scores</CardTitle>
            <CardDescription className="text-zinc-500 flex items-center gap-2">
              <span className="text-emerald-500 font-medium">+1.3%</span> vs last month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={CHANNEL_DATA}>
                <Tooltip
                  contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", color: "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="online"
                  stroke="#ffffff"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="store"
                  stroke="#71717a"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-white/10">
          <CardHeader>
            <CardTitle className="text-zinc-200">Interview Categories</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", color: "#fff" }} />
                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
