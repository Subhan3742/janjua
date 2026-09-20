import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/admin-data";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <div className="min-h-dvh lg:pl-64">
      <AdminNav email={user.email ?? "Signed in"} />
      <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-12">{children}</div>
    </div>
  );
}
