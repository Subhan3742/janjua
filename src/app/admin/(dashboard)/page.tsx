import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AdminPageHeader, EmptyState, Panel, StatCard, StatusBadge } from "@/components/admin/ui";
import { getDashboardStats } from "@/lib/admin-data";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const stats = await getDashboardStats();

  return (
    <>
      <AdminPageHeader
        title="Overview"
        description="A snapshot of inquiries, gallery content and what is currently live on the website."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total inquiries" value={stats.totalInquiries} />
        <StatCard
          label="New inquiries"
          value={stats.newInquiries}
          hint="Waiting for a first reply"
          accent={stats.newInquiries > 0}
        />
        <StatCard label="Gallery images" value={stats.galleryImages} />
        <StatCard label="Active services" value={stats.activeServices} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-light text-cream">Recent inquiries</h2>
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center gap-1.5 text-[11.5px] tracking-[0.16em] text-gold uppercase transition-opacity hover:opacity-75"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          </div>

          {stats.recentInquiries.length === 0 ? (
            <EmptyState
              title="No inquiries yet"
              description="Requests submitted from the contact form will appear here."
            />
          ) : (
            <ul className="divide-y divide-cream/8">
              {stats.recentInquiries.map((inquiry) => (
                <li key={inquiry.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] text-cream">{inquiry.name}</p>
                    <p className="mt-1 truncate text-[13px] text-cream/40">
                      {inquiry.service} · {inquiry.phone}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <StatusBadge status={inquiry.status} />
                    <p className="mt-1.5 text-[11.5px] text-cream/30">
                      {formatDateTime(inquiry.created_at)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel>
          <h2 className="mb-5 font-display text-xl font-light text-cream">Live promotion</h2>

          {stats.activePromotion ? (
            <div>
              <p className="font-display text-[3.4rem] leading-none text-gilded">
                {stats.activePromotion.discount}%
              </p>
              <p className="mt-4 text-[16px] text-cream">{stats.activePromotion.title}</p>
              {stats.activePromotion.description ? (
                <p className="mt-2 text-[13.5px] leading-relaxed text-cream/45">
                  {stats.activePromotion.description}
                </p>
              ) : null}
              <Link
                href="/admin/promotions"
                className="mt-6 inline-flex items-center gap-1.5 text-[11.5px] tracking-[0.16em] text-gold uppercase transition-opacity hover:opacity-75"
              >
                Edit promotion
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          ) : (
            <EmptyState
              title="No promotion running"
              description="Activate one to show the offer banner on the website."
            />
          )}
        </Panel>
      </div>
    </>
  );
}
