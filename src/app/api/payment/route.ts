import crypto from "crypto";
import { z } from "zod";
import { formSchema } from "@/src/lib/zodSchemas";
import axios from "axios";
import { NextResponse } from "next/server";
import { corsHeaders } from "@/src/lib/corsHeaders";
import { calculateSHA384 } from "@/src/lib/sign";
import { deliveryPrices } from "@/src/lib/deliveryPrices";
import prisma from "@/src/lib/prisma";

const DataSchema = z.object({
  formValues: formSchema,
  cart: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number(),
    }),
  ),
  cartId: z.string(),
  price: z.number(),
  locale: z.enum(["en", "pl"]),
});

export async function POST(req: Request): Promise<Response> {
  const unSafeData = await req.json();
  const parsedData = DataSchema.safeParse(unSafeData);
  if (
    !parsedData.success ||
    parsedData.error ||
    typeof parsedData.data === "undefined"
  ) {
    return NextResponse.json(
      {
        error: "400 Bad Request",
        message: `Invalid request body\n${parsedData.error}`,
      },
      { headers: corsHeaders, status: 400 },
    );
  }

  const data = parsedData.data;
  const formValues = data.formValues;

  const { cart } = data;

  if (!Object.keys(cart).length) {
    NextResponse.json(
      { error: "400 Bad Request", message: "Cart must not be empty" },
      { headers: corsHeaders, status: 400 },
    );
  }

  const previousOrder = await prisma.order.findUnique({
    where: {
      cartId: data.cartId,
    },
  });

  if (previousOrder && !previousOrder.paid) {
    await prisma.order.update({
      where: {
        id: previousOrder.id,
      },
      data: {
        cart: {
          deleteMany: {},
        },
      },
    });
    await prisma.order.delete({
      where: {
        id: previousOrder.id,
      },
    });
  } else if (previousOrder?.paid) {
    return NextResponse.json(
      {
        error: "400 Bad Request",
        message:
          "Invalid cartId. Object with this cartId already exists and it is paid for. Please generate new cartId.",
      },
      { headers: corsHeaders, status: 400 },
    );
  }

  let productsPrice = 0;

  for (const cartItem of cart) {
    const product = await prisma.product.findUnique({
      where: { id: cartItem.productId, archived: false },
    });

    if (!product) {
      return NextResponse.json(
        {
          error: "400 Bad Request",
          message: "One of the cart items does not exist",
        },
        { headers: corsHeaders, status: 400 },
      );
    }

    if (cartItem.quantity < 1 || !Number.isInteger(cartItem.quantity)) {
      return NextResponse.json(
        {
          error: "400 Bad Request",
          message: "One of the cart items has an incorrect quantity",
        },
        { headers: corsHeaders, status: 400 },
      );
    }

    productsPrice += cartItem.quantity * product.price;
  }

  const deliveryFee =
    productsPrice >= 200 ? 0 : deliveryPrices[formValues.shippingMethod];

  const paymentFee =
    Math.round(((productsPrice + deliveryFee) * 0.0129 + 0.3) * 100) / 100;
  const addedPrice = productsPrice + deliveryFee + paymentFee;
  const fullPrice = Math.ceil(addedPrice * 100) / 100;
  const apiPrice = fullPrice * 100; // api accepts amount as an integer of polish gr

  if (fullPrice !== data.price) {
    return NextResponse.json(
      {
        error: "400 Bad Request",
        message:
          "Client's price does not match the price calculated on the server",
      },
      { headers: corsHeaders, status: 400 },
    );
  }

  const sessionId = crypto.randomBytes(16).toString("hex");
  const currency = "PLN";
  const merchantId = parseInt(process.env.P24_MERCHANT_ID as string);

  const hashData = {
    sessionId: sessionId,
    merchantId: merchantId,
    amount: apiPrice,
    currency: currency,
    crc: process.env.P24_CRC_KEY,
  };
  const sign = calculateSHA384(JSON.stringify(hashData));
  const phone = formValues.phone.startsWith("+")
    ? formValues.phone.slice(0, 1)
    : "48" + formValues.phone;

  let transaction;

  try {
    transaction = await axios.post(
      `https://${process.env.P24_API_DOMAIN}.przelewy24.pl/api/v1/transaction/register`,
      {
        merchantId: merchantId,
        posId: merchantId,
        sessionId: sessionId,
        amount: apiPrice,
        currency: currency,
        description: "Maharajamart zamówienie w sklepie online",
        email: formValues.email,
        client: formValues.name,
        address: formValues.address,
        zip: formValues.postalCode,
        country: "PL",
        phone: phone,
        language: data.locale,
        urlReturn: `${process.env.PUBLIC_URL}/payment/redirect/`,
        urlStatus: `${process.env.API_URL}/api/payment/status/`,
        waitForResult: true,
        timeLimit: 15,
        channel: 8199, // 8199 = 1 + 2 + 4 + 8192, card + ApplePay + GooglePay + transfer + traditional transfer + blik
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
    // eslint-disable-next-line
  } catch (error: any) {
    console.log(error!.response);
    throw error;
  }

  if (transaction!.status == 200) {
    try {
      await prisma.order.create({
        data: {
          locale: data.locale,
          sessionId: sessionId,
          formValues: formValues,
          deliveryFee: deliveryFee,
          cart: { create: cart },
          cartId: data.cartId,
          price: apiPrice,
        },
      });
    } catch (error) {
      console.error(error);
      return Response.json(
        { error: "Failed to register transaction in database" },
        { status: 500 },
      );
    }

    return Response.json({
      url: `https://${process.env.P24_API_DOMAIN}.przelewy24.pl/trnRequest/${transaction!.data.data.token}`,
      headers: corsHeaders,
    }); // This is fucking idiotic. Why would the przelewy24 wrap the token in a data object?? Leads to ridiculous code like this. I hate this api.
  } else {
    return Response.json(
      { error: "Failed to register przelewy24 transaction" },
      { status: 500 },
    );
  }
}
