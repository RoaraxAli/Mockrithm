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
import { getAdminMetrics, getAdminChartsData } from "@/lib/actions/admin.action";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    users: { total: 0, change: "0" },
    feedbacks: { total: 0, change: "0" },
    sessions: { total: 0, change: "0" },
    interviews: { total: 0, change: "0" }, // Mock data
  });

  const [chartsData, setChartsData] = useState({
    userGrowthData: [],
    interviewData: [],
    categoryData: [],
    dailyActivityData: [],
  });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [metricsRes, chartsRes] = await Promise.all([
          getAdminMetrics(),
          getAdminChartsData()
        ]);
        
        if (!isMounted) return;
        
        if (metricsRes.success && metricsRes.data) {
          setMetrics({
            users: metricsRes.data.users,
            feedbacks: metricsRes.data.feedbacks || { total: 0, change: 0 },
            sessions: metricsRes.data.sessions,
            interviews: { total: 1245, change: "+14" }, // Could also pull from real metrics if updated
          });
        }

        if (chartsRes.success && chartsRes.data) {
          setChartsData(chartsRes.data);
        }
      } catch (err) {
        console.error("Error loading metrics:", err);
      }
    };
    fetchData();
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-950 border-white/5 shadow-none hover:bg-zinc-900/20 transition-colors group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{metrics.users.total.toLocaleString()}</div>
                <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1 font-medium">
                  {metrics.users.change}% vs last month
                </p>
              </div>
              <div className="h-[40px] w-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartsData.userGrowthData.slice(-4)}>
                    <Line type="monotone" dataKey="thisYear" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-white/5 shadow-none hover:bg-zinc-900/20 transition-colors group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Interviews Generated
            </CardTitle>
            <FileText className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{metrics.interviews.total.toLocaleString()}</div>
                <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1 font-medium">
                  {metrics.interviews.change}% vs last month
                </p>
              </div>
              <div className="h-[40px] w-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartsData.interviewData.slice(-4)}>
                    <Line type="monotone" dataKey="online" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-white/5 shadow-none hover:bg-zinc-900/20 transition-colors group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Feedback Submissions
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{metrics.feedbacks.total.toLocaleString()}</div>
                <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1 font-medium">
                  {metrics.feedbacks.change}% vs last month
                </p>
              </div>
              <div className="h-[40px] w-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartsData.dailyActivityData.slice(-4)}>
                    <Bar dataKey="value" fill="#10b981" radius={[2,2,0,0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-white/5 shadow-none hover:bg-zinc-900/20 transition-colors group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Active Sessions
            </CardTitle>
            <Activity className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{metrics.sessions.total.toLocaleString()}</div>
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  {metrics.sessions.change}% vs last month
                </p>
              </div>
              <div className="h-[40px] w-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartsData.dailyActivityData.slice(-4)}>
                    <Line type="step" dataKey="value" stroke="#f43f5e" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row 1 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-5 bg-zinc-950 border-white/5 shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-100">User Growth</CardTitle>
            <CardDescription className="text-zinc-500">
              New user registrations over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartsData.userGrowthData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
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

        <Card className="col-span-4 lg:col-span-2 bg-zinc-950 border-white/5 shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-100">Interviews by Type</CardTitle>
            <CardDescription className="text-zinc-500">
              Volume breakdown by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartsData.interviewData}>
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-3 bg-zinc-950 border-white/5 shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-100">Daily Activity</CardTitle>
            <CardDescription className="text-zinc-500">
              Sessions conducted per day
              <span className="text-emerald-500 font-medium">+2.4%</span> vs last month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartsData.dailyActivityData}>
                <Tooltip
                  contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", color: "#fff" }}
                  cursor={{ fill: "#27272a" }}
                />
                <Bar dataKey="value" fill="#ffffff" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-4 lg:col-span-2 bg-zinc-950 border-white/5 shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-100">Average Scores</CardTitle>
            <CardDescription className="text-zinc-500 flex items-center gap-2">
              <span className="text-emerald-500 font-medium">+1.3%</span> vs last month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartsData.interviewData}>
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

        <Card className="col-span-4 lg:col-span-2 bg-zinc-950 border-white/5 shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-100">Interview Categories</CardTitle>
            <CardDescription className="text-zinc-500">
              Subject matter distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartsData.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartsData.categoryData.map((entry: any, index: number) => (
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
