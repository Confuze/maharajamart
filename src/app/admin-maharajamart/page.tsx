import type { Metadata } from "next";
import { PrismaClient } from "@prisma/client";
import AdminOrder from "@/src/components/AdminOrder";

export const metadata: Metadata = {
  title: "Admin panel",
};

export const dynamic = "force-dynamic";

export default async function Admin() {
  const prisma = new PrismaClient();
  const notPaidOrders = await prisma.order.findMany({
    where: { shipped: false, paid: true },
    orderBy: {
      createdAt: "asc",
    },
  });

  const last1000Orders = await prisma.order.findMany({
    where: {
      paid: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 1000,
  });
  console.log(notPaidOrders);

  return (
    <>
      <h1 className="font-serif text-secondary text-3xl lg:text-5xl font-bold">
        Maharajamart administration panel
      </h1>
      <h3 className="font-serif text-3xl">Orders to ship</h3>
      {notPaidOrders.length // why does javascript treat [] as a truthy value???
        ? notPaidOrders.map((order) => {
            return <AdminOrder order={order} key={order.id} />;
          })
        : "No orders yet"}
      <h3 className="font-serif text-3xl">Last 1000 orders</h3>
      {last1000Orders.length
        ? last1000Orders.map((order) => {
            return <AdminOrder order={order} key={order.id} />;
          })
        : "No orders yet"}
    </>
  );
}
