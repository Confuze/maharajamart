import { auth, signOut } from "@/auth";
import { Button } from "@/src/components/ui/button";
import { Toaster } from "@/src/components/ui/sonner";
import { Folder, Logs, Star } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    throw new Error("Authentication required");
  }

  return (
    <>
      <div className="flex">
        <nav className="basis-1/6 sticky top-0 flex flex-col justify-between h-screen py-12 px-4 border-b-neutral-200 border">
          <div>
            <Link href="/admin-maharajamart">
              <h1 className="text-xl">Maharajamart</h1>
              <p className="text-neutral-500 mb-1">Administration panel</p>
            </Link>
            <hr className="mb-4" />
            <Link
              href="/admin-maharajamart/orders"
              className="flex items-center gap-3 mb-2"
            >
              <Logs className="inline h-4 w-4" /> Orders
            </Link>
            <Link
              href="/admin-maharajamart/categories"
              className="flex items-center gap-3 mb-2"
            >
              <Folder className="inline h-4 w-4" /> Categories
            </Link>
            <Link
              href="/admin-maharajamart/featured"
              className="flex items-center gap-3"
            >
              <Star className="inline h-4 w-4" /> Featured products
            </Link>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({
                redirect: true,
                redirectTo: "/admin-maharajamart/login",
              });
            }}
          >
            <Button type="submit" variant="outline" className="w-full">
              Sign Out
            </Button>
          </form>
        </nav>
        <main className="basis-5/6 p-6 lg:p-12 min-h-[90vh]">{children}</main>
      </div>
      <Toaster richColors />
    </>
  );
}
