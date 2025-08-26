import { auth } from "@/auth";
import { cartColumns, Item } from "@/src/components/cartColumns";
import ChangeStatus from "@/src/components/ChangeStatus";
import { DataTable } from "@/src/components/ui/data-table";
import prisma from "@/src/lib/prisma";
import { statusTitles } from "@/src/lib/statusTitles";
import { notFound } from "next/navigation";

const deliveryMethodTitles = {
  CLOSE_DELIVERY: "Close delivery (uber, etc.)",
  COURIER: "Courier (DHL/DPD/UPS)",
  PARCEL_MACHINE: "Parcel machine (Inpost/Orlen paczka)",
  PICKUP_AT_STORE: "Pickup at store",
};

export const dynamic = "force-dynamic";

export default async function Order({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) {
    throw new Error("Authentication required");
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: {
      id: id,
    },
    include: { cart: true },
  });

  if (!order) return notFound();

  const status = order.status;
  let statusStyle = "";

  if (status == "WAITING_FOR_SHIPPING")
    statusStyle = "bg-slate-200 text-slate-900";
  else if (status == "IN_SHIPPING")
    statusStyle = "bg-orange-200 text-orange-900";
  else if (status == "DELIVERED") statusStyle = "bg-blue-200 text-blue-900";
  else if (status == "RECEIVED") statusStyle = "bg-lime-200 text-lime-900";
  else if (status == "CANCELLED") statusStyle = "bg-red-200 text-red-900";

  const data: Item[] = await Promise.all(
    order.cart.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { name: true, slug: true, category: true },
      });

      console.log(item, product);

      return {
        product: product!.name,
        quantity: item.quantity,
        productURL: `/products/${product!.category.slug}/${product!.slug}`,
      };
    }),
  );

  return (
    <div className="">
      <h1 className="font-bold text-3xl mb-4">
        Order from {order.createdAt.toLocaleString("en-GB")}
      </h1>
      <p>Total price: {order.price / 100} zł</p>
      <h2 className="font-bold text-2xl mt-8 mb-4">Delivery</h2>
      <p>
        Delivery method: {deliveryMethodTitles[order.formValues.shippingMethod]}
      </p>
      <p>
        Delivery fee (paid by customer, included in total price):{" "}
        {order.deliveryFee} zł
      </p>
      <p className="mt-3 mb-1">Order status:</p>
      <div className="flex gap-2">
        <div
          className={`${statusStyle} flex items-center w-fit px-3 py-[2px] rounded-md text-right font-bold`}
        >
          {statusTitles[status]}
        </div>
        <ChangeStatus id={id} status={status} />
      </div>
      <h2 className="font-bold text-2xl mt-8 mb-4">Customer information</h2>
      <p>Name: {order.formValues.name}</p>
      <p>Email address: {order.formValues.email}</p>
      <p>Phone number: {order.formValues.phone}</p>
      <p>Shipping address: {order.formValues.address}</p>
      <p>Postal code: {order.formValues.postalCode}</p>
      <p>Town: {order.formValues.town}</p>
      <p>Extra info from customer: {order.formValues.extraInfo || "N/A"}</p>
      <h2 className="font-bold text-2xl mt-8">Cart</h2>
      <DataTable columns={cartColumns} data={data} />
    </div>
  );
}
