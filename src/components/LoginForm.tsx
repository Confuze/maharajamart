"use client";

import { Input } from "@/src/components/ui/input";
import loginAction from "@/src/lib/loginAction";
import { useRouter } from "next/navigation";
import { useState } from "react";

function LoginForm() {
  const [invalid, setInvalid] = useState(false);
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    const res = await loginAction(formData);

    if (res.authenticated) {
      setInvalid(false);
      router.push("/admin-maharajamart");
    } else {
      setInvalid(true);
    }
  }

  return (
    <form
      action={onSubmit}
      className="*:block lg:w-1/5 border border-neutral-200 shadow p-8 rounded-lg"
    >
      {invalid && (
        <p className="text-red-700 text-sm">
          Invalid credentials. Please try again.
        </p>
      )}
      <label htmlFor="username">Username</label>
      <Input name="username" type="text" className="mb-2" />
      <label htmlFor="password">Password</label>
      <Input name="password" type="password" className="mb-6" />
      <button className="py-2 px-4 bg-black text-white rounded-md text-sm">
        Log in
      </button>
    </form>
  );
}

export default LoginForm;
