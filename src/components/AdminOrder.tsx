import { Order, PrismaClient } from "@prisma/client";
import { Button } from "./ui/button";
import { products } from "../data/products";
import Link from "next/link";
import { markAsShipped } from "../lib/markAsShipped";
import MarkAsShippedButton from "./MarkAsShippedButton";

function AdminOrder({ order }: { order: Order }) {
  return (
    <div className="bg-background2 p-4 rounded-xl">
      <h1 className="font-bold text-secondary text-lg">
        Order from {order.createdAt.toLocaleString("en-GB")}
      </h1>
      <p className="font-bold font-serif text-xl">Customer information</p>
      <p>Name: {order.formValues.name}</p>
      <p>Email address: {order.formValues.email}</p>
      <p>Phone number: {order.formValues.phone}</p>
      <p>Shipping address: {order.formValues.address}</p>
      <p>Postal code: {order.formValues.postalCode}</p>
      <p>Town: {order.formValues.town}</p>
      <p>Extra info from customer: {order.formValues.extraInfo || "N/A"}</p>
      <p className="font-bold font-serif text-xl">Cart</p>
      {order.cart.map((item, index) => {
        const product = products[item.categorySlug].products[item.productSlug];
        return (
          <div
            className="bg-primary p-2 rounded-lg text-background"
            key={index}
          >
            {index !== 0 && <br />}
            <p>Item #{index + 1}</p>
            <div>
              Product:{" "}
              <Link
                className="hover:underline text-blue-300"
                target="_blank"
                href={`/products/${item.categorySlug}/${item.productSlug}`}
              >
                {product.displayName}
              </Link>
            </div>
            <p>Quantity: {item.quantity}</p>
          </div>
        );
      })}
      <p className="text-red-600 font-bold text-2xl">NOT SHIPPED</p>
      <MarkAsShippedButton id={order.id} unMark={order.shipped} />
    </div>
  );
}

export default AdminOrder;
