// TODO: fix

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-8 flex h-[70vh] items-center justify-center flex-col">
      <h2 className="text-9xl">404</h2>
      <p className="text-neutral-500 text-lg">This page does not exist</p>
      <Link
        className="mt-4 text-xl font-bold hover:underline"
        href="/admin-maharajamart"
      >
        Return Home
      </Link>
    </div>
  );
}
