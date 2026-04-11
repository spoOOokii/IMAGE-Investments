import { notFound } from "next/navigation";

import { AdminPropertyForm } from "@/components/admin-property-form";
import { getEditablePropertyBySlug } from "@/lib/admin-property-store";

export default async function EditAdminPropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getEditablePropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  return <AdminPropertyForm mode="edit" initialProperty={property} />;
}
