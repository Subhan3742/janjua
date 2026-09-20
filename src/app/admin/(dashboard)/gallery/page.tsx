import { AdminPageHeader } from "@/components/admin/ui";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { getAdminGallery } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await getAdminGallery();

  return (
    <>
      <AdminPageHeader
        title="Gallery"
        description="Upload photographs of completed work. Featured images also appear on the home page."
      />
      <GalleryManager images={images} />
    </>
  );
}
