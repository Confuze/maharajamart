// Date ordered
// Status
// Name
// Price
// Town
// Actions

import { auth } from "@/auth";
import { columns, Order, Status } from "@/src/components/columns";
import { DataTable } from "@/src/components/ui/data-table";
import prisma from "@/src/lib/prisma";
import { statusTitles } from "@/src/lib/statusTitles";

export const dynamic = "force-dynamic";

export default async function Orders() {
  const session = await auth();

  if (!session) {
    throw new Error("Authentication required");
  }

  const notShippedOrders = await prisma.order.findMany({
    where: { status: "WAITING_FOR_SHIPPING", paid: true },
    select: {
      createdAt: true,
      status: true,
      price: true,
      id: true,
      formValues: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const notShippedData: Order[] = notShippedOrders.map((order) => {
    return {
      dateOrdered: order.createdAt.toLocaleString("en-GB"),
      status: statusTitles[order.status] as Status,
      name: order.formValues.name,
      town: order.formValues.town,
      price: order.price / 100,
      id: order.id,
    };
  });

  const allOrders = await prisma.order.findMany({
    where: { paid: true },
    select: {
      createdAt: true,
      status: true,
      price: true,
      id: true,
      formValues: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const allData: Order[] = allOrders.map((order) => {
    return {
      dateOrdered: order.createdAt.toLocaleString("en-GB"),
      status: statusTitles[order.status] as Status,
      name: order.formValues.name,
      town: order.formValues.town,
      price: order.price / 100,
      id: order.id,
    };
  });

  const defaultSorting = [
    {
      id: "dateOrdered",
      desc: true,
    },
  ];

  return (
    <>
      <h2 className="mb-2 text-2xl">Orders waiting to be shipped</h2>
      <p>{notShippedOrders.length} orders</p>
      <DataTable
        columns={columns}
        data={notShippedData}
        pagination
        filtered
        sorting={defaultSorting}
      />
      <h2 className="mb-2 text-2xl">All orders</h2>
      <p>{allOrders.length} orders</p>
      <DataTable
        columns={columns}
        data={allData}
        pagination
        filtered
        sorting={defaultSorting}
      />
    </>
  );
}
