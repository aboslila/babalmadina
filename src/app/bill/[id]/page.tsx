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
      <div className="text-center mb-2">
        <p className="text-4xl mb-2">🧾</p>
        <h1 className="text-2xl font-extrabold">
           <span className="text-red-600">الطلبية</span>{" "}
          <span dir="" className="text-blue-600">#{order.id}</span>
         
        </h1>
        <p className="text-sm text-gray-800 mt-1">
          {customer.full_name} · {customer.phone}
        </p>
      </div>

      <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-950">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 ${
              i !== items.length - 1 ? "border-b border-gray-100 dark:border-gray-900" : ""
            }`}
          >
            <img
              src={`/products/${item.art_no}.jpg`}
              alt={item.art_no}
              className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-gray-900 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.art_no}</p>
              <p className="text-xs text-gray-500">× {item.quantity} كرتون</p>
            </div>
            <span dir="rtr" className="font-semibold text-red-600 shrink-0">
              {(item.carton_price * item.quantity).toFixed(2)} <span className="font-semibold text-red-600" >د.ل</span>
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center font-bold text-lg px-1">
        <span dir="rtl">الإجمالي</span>
        <span dir="rtr" className="text-green-700">
          {order.total.toFixed(2)} <span className="text-sm text-red-600">دينار ليبي</span>
        </span>
      </div>

      <div dir="rtl" className="bg-yellow-50 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-400 rounded-2xl p-4 text-center font-semibold border border-yellow-200 dark:border-yellow-900">
        ⏳ لم يتم الدفع بعد
      </div>

      <p dir="rtl" className="text-sm text-gray-800 text-center">
        سنتصل بك على هذا الرقم  <span dir="ltr">{customer.phone}</span> لتنظيم الإستلام
      </p>
    </main>
  );
}