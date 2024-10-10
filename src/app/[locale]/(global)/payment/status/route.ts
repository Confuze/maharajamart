import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { calculateSHA384 } from "@/src/lib/sign";

export async function POST(req: Request) {
  const data = await req.json();
  const prisma = new PrismaClient();
  const order = await prisma.order.findUnique({
    where: { sessionId: data.sessionId as string },
  });

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

  await prisma.order.update({
    where: { sessionId: data.sessionId as string },
    data: {
      paid: true,
    },
  });

  prisma.$disconnect;
  return Response.json({ message: "Success" }, { status: 200 });
}
