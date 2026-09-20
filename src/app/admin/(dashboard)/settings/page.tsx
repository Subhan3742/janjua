import { AdminPageHeader } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/settings-form";
import { getAdminSettings } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();

  return (
    <>
      <AdminPageHeader
        title="Site Settings"
        description="Contact details and social links used across the website."
      />
      <SettingsForm settings={settings} />
    </>
  );
}
