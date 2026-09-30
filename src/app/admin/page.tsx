import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/admin-auth";
import { db, Product } from "@/lib/db";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const loggedIn = await isAdminLoggedIn();
  if (!loggedIn) redirect("/admin/login");

  const products = db
    .prepare("SELECT * FROM products ORDER BY id")
    .all() as Product[];

  return <AdminDashboardClient products={products} />;
}
