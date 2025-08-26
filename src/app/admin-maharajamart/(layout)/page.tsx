import type { Metadata } from "next";
import { auth } from "@/auth";
import Link from "next/link";
import prisma from "@/src/lib/prisma";

export const metadata: Metadata = {
  title: "Admin panel",
};

export const dynamic = "force-dynamic";

export default async function Admin() {
  const session = await auth();

  if (!session) {
    throw new Error("Authentication required");
  }

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
    select: { price: true },
  });

  const waitingToBeShipped = await prisma.order.count({
    where: { status: "WAITING_FOR_SHIPPING" },
  });

  const revenue = orders
    .map((order) => order.price / 100)
    .reduce((a, b) => a + b);

  return (
    <>
      <h1 className="text-3xl lg:text-5xl font-bold">
        Maharajamart administration panel
      </h1>
      <div className="flex gap-8 justify-between pr-96 mt-8">
        <div className="border border-neutral-200 w-full p-4 rounded-xl">
          <h2 className="text-neutral-500">Orders in the last 30 days</h2>
          <p className="text-3xl">{orders.length}</p>
        </div>
        <div className="border border-neutral-200 w-full p-4 rounded-xl">
          <h2 className="text-neutral-500">Orders waiting to be shipped</h2>
          <p className="text-3xl">{waitingToBeShipped}</p>
        </div>
        <div className="border border-neutral-200 w-full p-4 rounded-xl">
          <h2 className="text-neutral-500">Revenue from the last 30 days</h2>
          <p className="text-3xl">
            {revenue.toLocaleString("en-GB", { minimumFractionDigits: 2 })} zł
          </p>
        </div>
      </div>
      <div className="flex gap-8 justify-between pr-96 mt-8">
        <Link
          href="/admin-maharajamart/orders"
          className="w-full hover:underline"
        >
          <div className="border border-neutral-200 w-full p-4 rounded-xl">
            <h2>See orders</h2>
          </div>
        </Link>
        <Link
          href="/admin-maharajamart/categories"
          className="w-full hover:underline"
        >
          <div className="border border-neutral-200 w-full p-4 rounded-xl">
            <h2>Edit products</h2>
          </div>
        </Link>
        <Link
          href="/admin-maharajamart/featured"
          className="w-full hover:underline"
        >
          <div className="border border-neutral-200 w-full p-4 rounded-xl">
            <h2>Edit featured products</h2>
          </div>
        </Link>
      </div>
    </>
  );
}
