import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/admin-auth";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminPage() {
  const loggedIn = await isAdminLoggedIn();
  if (!loggedIn) redirect("/admin/login");

  return <AdminDashboardClient />;
}
