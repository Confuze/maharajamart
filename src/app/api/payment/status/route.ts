import axios from "axios";
import { calculateSHA384 } from "@/src/lib/sign";
import { resend } from "@/src/lib/resend";
import OrderConfirmationEmail from "@/transactional/emails/order-confirmation";
import prisma from "@/src/lib/prisma";

export async function POST(req: Request) {
  const data = await req.json();
  const order = await prisma.order.findUnique({
    where: { sessionId: data.sessionId as string },
  });

  // NOTE: This should be completely secure since sessionId should always be a secret
  // but rejecting requests from adresses other than przelewy24 might be a good idea.

  const merchantId = process.env.P24_MERCHANT_ID;

  const hashData = {
    sessionId: order?.sessionId,
    orderId: data.orderId,
    amount: order?.price,
    currency: "PLN",
    crc: process.env.P24_CRC_KEY,
  };
  const sign = calculateSHA384(JSON.stringify(hashData));

  const verify = await axios.put(
    `https://${process.env.P24_API_DOMAIN}.przelewy24.pl/api/v1/transaction/verify`,
    {
      merchantId: merchantId,
      posId: merchantId,
      sessionId: order?.sessionId,
      amount: order?.price,
      currency: "PLN",
      orderId: data.orderId,
      sign: sign,
    },
    {
      auth: {
        username: process.env.P24_MERCHANT_ID as string,
        password: process.env.P24_API_KEY as string,
      },
    },
  );

  if (verify.status != 200) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }

  const document = await prisma.order.update({
    where: { sessionId: data.sessionId as string },
    data: {
      paid: true,
    },
    include: {
      cart: true,
    },
  });

  const ids = document.cart.map((cartItem) => cartItem.productId);

  console.log("route: ", ids);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  const images = products
    .filter((product) => product.imageStoredInFs)
    .map((product) => {
      return {
        path: `${process.env.PUBLIC_URL}/api/publicAssets/uploads/${product.id}.webp`,
        filename: `${product.id}.webp`,
        contentId: product.id,
      };
    });

  console.log(images);

  resend.emails.send(
    {
      from: "Maharajamart <maharajamart@resend.dev>",
      to: document.formValues.email,
      subject: "Potwierdzenie zamówienia",
      react: OrderConfirmationEmail({ order: document, products: products }),
      tags: [
        {
          name: "category",
          value: "confirmation",
        },
      ],
      headers: {
        "X-Entity-Ref-ID": crypto.randomUUID(),
      },
      attachments:
        images.length == products.length
          ? images
          : [
              ...images,
              {
                path: `${process.env.PUBLIC_URL}/api/publicAssets/picturePlaceholder.png`,
                filename: "picturePlaceholder.png",
                contentId: "placeholder",
              },
            ],
    },
    { idempotencyKey: `confirmation/${document.id}` },
  );

  return Response.json({ message: "Success" }, { status: 200 });
}
