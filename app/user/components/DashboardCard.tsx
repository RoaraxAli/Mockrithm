import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardCardProps {
  title: string
  value: string | number
  description?: string
}

export function DashboardCard({ title, value, description }: DashboardCardProps) {
  return (
    <Card className="glass-card hover:border-violet-500/30 hover:shadow-[0_0_20px_rgba(124,58,237,0.04)] hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black text-white">{value}</div>
        {description && <p className="text-xs text-gray-400 mt-1.5 leading-relaxed font-medium">{description}</p>}
      </CardContent>
    </Card>
  )
}