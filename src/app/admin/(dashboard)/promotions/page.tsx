import { AdminPageHeader } from "@/components/admin/ui";
import { PromotionsManager } from "@/components/admin/promotions-manager";
import { getAdminPromotions } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  const promotions = await getAdminPromotions();

  return (
    <>
      <AdminPageHeader
        title="Promotions"
        description="The discount, headline and supporting text shown in the hero badge and the offer banner."
      />
      <PromotionsManager promotions={promotions} />
    </>
  );
}
