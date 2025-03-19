"use server";

import { signIn } from "@/auth";

export default async function loginAction(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  try {
    await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
  } catch (error) {
    return { authenticated: false, error: error };
  }
  return { authenticated: true };
}
