import { db, Order, OrderItem, Customer } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function BillPage({ params }: { params: Promise<{ id: string }> }) {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/login");

  const { id } = await params;

  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as Order | undefined;
  if (!order || order.customer_id !== customer.id) {
    return <main className="max-w-xl mx-auto px-4 py-10">Order not found.</main>;
  }

  const items = db
    .prepare("SELECT * FROM order_items WHERE order_id = ?")
    .all(order.id) as OrderItem[];

  return (
    <main className="max-w-xl mx-auto px-4 py-10 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Order #{order.id}</h1>
      <p className="text-sm text-gray-500">Billed to: {customer.full_name} ({customer.phone})</p>

      <div className="border rounded divide-y">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between p-3">
            <span>{item.product_name} × {item.quantity}</span>
            <span>${(item.unit_price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>${order.total.toFixed(2)}</span>
      </div>

      <div className="bg-yellow-100 text-yellow-800 rounded p-3 text-center font-medium">
        Payment status: Not paid yet
      </div>

      <p className="text-sm text-gray-500 text-center">
        The shop will call you at {customer.phone} to arrange pickup.
      </p>
    </main>
  );
}