import { AdminPageHeader } from "@/components/admin/ui";
import { InquiriesTable } from "@/components/admin/inquiries-table";
import { getAdminInquiries } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const inquiries = await getAdminInquiries();

  return (
    <>
      <AdminPageHeader
        title="Inquiries"
        description="Every measurement request submitted from the website. Search, filter and update where each one stands."
      />
      <InquiriesTable inquiries={inquiries} />
    </>
  );
}
