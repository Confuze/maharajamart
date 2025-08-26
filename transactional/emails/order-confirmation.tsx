import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { fontFamily } from "tailwindcss/defaultTheme";
import { getLocalisedName } from "../../src/data/products";
import { orderPayloadDeep } from "../../src/lib/prismaTypes";
import { Product } from "@prisma/client";

const baseUrl = process.env.PUBLIC_URL;

export default function OrderConfirmationEmail({
  order,
  products,
}: {
  order: orderPayloadDeep;
  products: Product[];
}) {
  const { locale } = order;
  const english = locale == "en";

  return (
    <Html>
      <Head></Head>
      <Preview>
        {english
          ? "Your order has been processed!"
          : "Otrzymaliśmy twoje zamówienie!"}
      </Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                background: "#F9F7F0",
                background2: "#EAE2DD",
                primary: "#1D1816",
                secondary: "#973543",
              },
              fontFamily: {
                sans: ["var(--font-sans)", ...fontFamily.sans],
                serif: ["var(--font-serif)", ...fontFamily.serif],
              },
            },
          },
        }}
      >
        <Body
          className="p-4 m-0 bg-neutral-200"
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
          }}
        >
          <Container className="min-w-[700px] p-0 h-full bg-neutral-100">
            <Heading className="text-secondary my-0 px-4 pt-4">
              Maharajamart
            </Heading>
            <Section className="px-4">
              <Text className="text-lg mt-8">
                {english ? "Welcome" : "Witaj"} Józef Nowak,
              </Text>
              <Text>
                {english
                  ? "Thank you for shopping at maharajamart. Your order is being prepared. You will receive the tracking information as soon as we ship it."
                  : "Dziękujemy za skorzystanie z naszego sklepu. Twoje zamówienie jest przygotowane. Otrzymasz informacje dotyczące śledzenia przesyłki gdy ją wyślemy."}
              </Text>
            </Section>
            <Section className="px-4">
              <Row className="table-fixed">
                <Column className="align-top">
                  <Text className="font-bold mb-0">
                    {english ? "Adress" : "Adres"}
                  </Text>
                  <Text className="my-0">
                    {order.formValues.name}
                    <br />
                    {order.formValues.address}
                    <br />
                    {order.formValues.postalCode} {order.formValues.town}
                  </Text>
                </Column>
                <Column className="align-top">
                  <Text className="font-bold mb-0">
                    {english ? "Order date" : "Data zamówienia"}
                  </Text>
                  <Text className="my-0">
                    {order.createdAt.toLocaleDateString(locale)}
                  </Text>
                </Column>
                <Column className="align-top">
                  <Text className="font-bold mb-0">
                    {english ? "Order number" : "Numer zamówienia"}
                  </Text>
                  <Text className="my-0">{order.id}</Text>
                </Column>
              </Row>
            </Section>
            <Section className="px-4">
              <Text className="text-xl mt-8">
                {english ? "Your articles" : "Twoje artykuły"}
              </Text>
              <table className="mb-[16px]" width="100%">
                <tr>
                  <th className="border-0 border-gray-200 border-b border-solid py-[8px]">
                    &nbsp;
                  </th>
                  <th
                    align="left"
                    className="border-0 border-gray-200 border-b border-solid py-[8px] text-gray-500"
                    colSpan={6}
                  >
                    <Text className="font-semibold">
                      {english ? "Product" : "Produkt"}
                    </Text>
                  </th>
                  <th
                    align="center"
                    className="border-0 border-gray-200 border-b border-solid py-[8px] text-gray-500"
                  >
                    <Text className="font-semibold">
                      {english ? "Quantity" : "Ilość"}
                    </Text>
                  </th>
                  <th
                    align="center"
                    className="border-0 border-gray-200 border-b border-solid py-[8px] text-gray-500"
                  >
                    <Text className="font-semibold">
                      {english ? "Price" : "Cena"}
                    </Text>
                  </th>
                </tr>
                {order.cart.map((cartItem) => {
                  const product = products.find(
                    (product) => product.id == cartItem.productId,
                  );
                  if (!product) return;

                  return (
                    <tr key={cartItem.id}>
                      <td className="border-0 border-gray-200 border-b border-solid py-[8px]">
                        <Img
                          alt={getLocalisedName(locale, product)}
                          className="rounded-[8px] object-cover"
                          height={110}
                          src={
                            product.imageStoredInFs
                              ? `cid:${product.id}`
                              : "cid:placeholder"
                          }
                        />
                      </td>
                      <td
                        align="left"
                        className="border-0 border-gray-200 border-b border-solid py-[8px]"
                        colSpan={6}
                      >
                        <Text>{getLocalisedName(locale, product)}</Text>
                      </td>
                      <td
                        align="center"
                        className="border-0 border-gray-200 border-b border-solid py-[8px]"
                      >
                        <Text>{cartItem.quantity}</Text>
                      </td>
                      <td
                        align="center"
                        className="border-0 border-gray-200 border-b border-solid py-[8px]"
                      >
                        <Text>{product.price} zł</Text>
                      </td>
                    </tr>
                  );
                })}
              </table>
              <Row>
                <Column>
                  <Text className="my-0">
                    {english
                      ? "Product price (+ transactio fee)"
                      : "Koszt produktów (+ opłata za płatność)"}
                  </Text>
                </Column>
                <Column>
                  <Text className="text-right my-0">
                    {(order.price / 100 - order.deliveryFee).toFixed(2)} zł
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className="my-0">Koszt dostawy</Text>
                </Column>
                <Column>
                  <Text className="text-right my-0">
                    {order.deliveryFee} zł
                  </Text>
                </Column>
              </Row>
              <Row className="font-bold">
                <Column>
                  <Text className="text-lg my-0">
                    {english ? "Total cost" : "Koszt całkowity"}
                  </Text>
                </Column>
                <Column>
                  <Text className="text-right text-lg my-0">
                    {(order.price / 100).toFixed(2)} zł
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className="px-4 py-4">
              <Text className="text-xl">
                {english ? "Order cancellation" : "Anulowanie zamówienia"}
              </Text>
              <Text className="mb-0">
                {english
                  ? "To cancel your order, click"
                  : "Aby anulować zamówienie, kliknij"}{" "}
                <Link href={`${baseUrl}/order-cancellation`}>
                  {english ? "here" : "tutaj"}
                </Link>
              </Text>
            </Section>
            <Section className="px-4 pb-4">
              <Text>
                {english ? "Best regards," : "Pozdrawiamy,"}
                <br />
                {english ? "Maharajamart team" : "zespół Maharajamart"}
              </Text>
            </Section>
            <Section className="bg-secondary text-neutral-100 px-4">
              <Link
                className="font-bold text-3xl block my-4 text-neutral-100"
                href={baseUrl}
              >
                Maharajamart
              </Link>
              <Link
                className="font-bold text-lg text-neutral-100 block mb-2"
                href={`${baseUrl}/branches`}
              >
                {english ? "Branches & contact" : "Placówki i kontakt"}
              </Link>
              <Link
                className="font-bold text-lg text-neutral-100"
                href={`${baseUrl}/order-cancellation`}
              >
                {english ? "Order cancellation" : "Anulowanie zamówienia"}
              </Link>
              <Text className="mb-0 mt-4">
                {english
                  ? "All prices include the VAT tax"
                  : "Wszystkie podane ceny zawierają podatek VAT"}
              </Text>
              <Text className="mt-0">
                {english
                  ? 'This email was automatically generated. Please do not respond to it. If you need to contact the Maharajamart team, visit the "Branches & contact" page on our website'
                  : 'Ten email został wygenerowany automatycznie. Proszę na niego nie odpowiadać. Jeśli potrzebujesz skontaktować się z zespołem Maharajamart, odwiedź zakładkę "Placówki i kontakt" na naszej stronie internetowej.'}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
