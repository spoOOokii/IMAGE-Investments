import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata = {
  title: "تسجيل الدخول | Image Investments",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const redirectTo = typeof next === "string" && next.startsWith("/") ? next : "/admin";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
      <AdminLoginForm redirectTo={redirectTo} />
    </div>
  );
}
