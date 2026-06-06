import { getCurrentUser } from "@/lib/actions/auth.action"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminNavbar } from "@/components/admin-navbar"
import { AdminTransitionWrapper } from "@/components/AdminTransitionWrapper"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  const allowedAdmins = ["ahmed@gmail.com"]

  if (!user) {
    redirect("/sign-in")
  } else if (!allowedAdmins.includes(user.email || "")) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminNavbar adminName={user.name} />
        <AdminTransitionWrapper>
          <main className="page-content px-4 py-6 lg:px-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </AdminTransitionWrapper>
      </div>
    </div>
  )
}
