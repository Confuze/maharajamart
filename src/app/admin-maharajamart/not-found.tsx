import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>This page does not exist</p>
      <Link href="/admin-maharajamart">Return Home</Link>
    </div>
  );
}
