import crypto from "crypto";
import { ICart } from "@/src/lib/storage";
import { z } from "zod";
import { formSchema } from "@/src/lib/zodSchemas";
import { products } from "@/src/data/products";
import axios from "axios";
import { NextResponse } from "next/server";
import { corsHeaders } from "@/src/lib/corsHeaders";
import { PrismaClient } from "@prisma/client";
import { calculateSHA384 } from "@/src/lib/sign";

interface IData {
  formValues: z.infer<typeof formSchema>;
  cart: ICart;
}

export async function POST(req: Request) {
  const data = (await req.json()) as IData;
  const prisma = new PrismaClient();

  const parsedForm = formSchema.safeParse(data.formValues);
  if (
    !parsedForm.success ||
    parsedForm.error ||
    typeof parsedForm.data === "undefined"
  ) {
    return NextResponse.json(
      { error: "400 Bad Request", message: "Incorrect checkout form data" },
      { headers: corsHeaders, status: 400 },
    );
  }
  const formValues = parsedForm.data;

  const { cart } = data;

  if (!Object.keys(cart).length) {
    NextResponse.json(
      { error: "400 Bad Request", message: "Cart must not be empty" },
      { headers: corsHeaders, status: 400 },
    );
  }

  const productsPrice = (() => {
    let price = 0;
    if (!cart) return price;

    Object.keys(cart).forEach((key) => {
      const cartItem = cart[key]!;
      const product =
        products[cartItem.categorySlug].products[cartItem.productSlug];
      if (!product) {
        NextResponse.json(
          {
            error: "400 Bad Request",
            message: "One of the cart items does not exist",
          },
          { headers: corsHeaders, status: 400 },
        );
      }

      if (cartItem.quantity < 1 || !Number.isInteger(cartItem.quantity)) {
        NextResponse.json(
          {
            error: "400 Bad Request",
            message: "One of the cart items has an incorrect quantity",
          },
          { headers: corsHeaders, status: 400 },
        );
      }
      price += cartItem.quantity * product.price!;
    });

    return price;
  })();
  const deliveryFee = productsPrice >= 200 ? 0 : 20;
  const paymentFee =
    Math.round(((productsPrice + deliveryFee) * 0.0129 + 0.3) * 100) / 100;
  const fullPrice = Math.round(
    (productsPrice + deliveryFee + paymentFee) * 100,
  );
  const sessionId = crypto.randomBytes(16).toString("hex");
  const currency = "PLN";
  const merchantId = parseInt(process.env.P24_MERCHANT_ID as string);

  const hashData = {
    sessionId: sessionId,
    merchantId: merchantId,
    amount: fullPrice,
    currency: currency,
    crc: process.env.P24_CRC_KEY,
  };
  const sign = calculateSHA384(JSON.stringify(hashData));
  const phone = formValues.phone.startsWith("+")
    ? formValues.phone.slice(0, 1)
    : "48" + formValues.phone;

  const transaction = await axios.post(
    `https://${process.env.P24_API_DOMAIN}.przelewy24.pl/api/v1/transaction/register`,
    {
      merchantId: merchantId,
      posId: merchantId,
      sessionId: sessionId,
      amount: fullPrice,
      currency: currency,
      description: "Maharajamart zamówienie w sklepie online",
      email: formValues.email,
      client: formValues.name,
      address: formValues.address,
      zip: formValues.postalCode,
      country: "PL",
      phone: phone,
      language: "PL", // TODO: Localise
      urlReturn: `${process.env.PUBLIC_URL}/payment/success/`,
      urlStatus: `${process.env.API_URL}/payment/status/`,
      waitForResult: true,
      timeLimit: 15,
      channel: 16,
      sign: sign,
      encoding: "UTF-8",
    },
    {
      auth: {
        username: process.env.P24_MERCHANT_ID as string,
        password: process.env.P24_API_KEY as string,
      },
    },
  );

  if (transaction.status == 200) {
    try {
      const order = await prisma.order.create({
        data: {
          sessionId: sessionId,
          formValues: formValues,
          cart: Object.values(cart),
          price: fullPrice,
        },
      });
      console.log(order);
    } catch (error) {
      return console.error(error);
    } finally {
      prisma.$disconnect;
    }

    return Response.json({
      url: `https://${process.env.P24_API_DOMAIN}.przelewy24.pl/trnRequest/${transaction.data.data.token}`,
      headers: corsHeaders,
    }); // This is fucking idiotic. Why would the przelewy24 wrap the token in a data object?? Leads to ridiculous code like this. I hate this api.
  }
}
