import { Toaster } from "@/src/components/ui/sonner";
import { fontSans, fontSerif } from "../fonts";
import { cn } from "@/src/lib/utils";
import "@/src/styles/globals.css";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="min-h-full relative scroll-smooth" lang="en">
      <body
        className={cn(
          "min-h-screen h-full text-primary bg-repeat bg-backround font-sans antialiased",
          fontSans.variable,
          fontSerif.variable,
        )}
      >
        <header className="w-full p-4 border-b-neutral-200 border">
          <h1>Maharajamart administration panel</h1>
        </header>
        <main className="p-6 lg:p-12 min-h-[90vh]">{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}
