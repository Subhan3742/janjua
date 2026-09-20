import { AdminPageHeader } from "@/components/admin/ui";
import { ServicesManager } from "@/components/admin/services-manager";
import { getAdminServices } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await getAdminServices();

  return (
    <>
      <AdminPageHeader
        title="Services"
        description="Control which services appear on the website, in what order, and how each one is described."
      />
      <ServicesManager services={services} />
    </>
  );
}
