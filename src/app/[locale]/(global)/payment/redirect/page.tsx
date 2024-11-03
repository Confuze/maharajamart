"use client";

import { checkForPaidOrder } from "@/src/lib/checkForOrder";
import { useAppStore } from "@/src/lib/storage";
import { useCartId } from "@/src/lib/useStore";
import { useRouter } from "@/src/navigation";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useInsertionEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

function Redirect() {
  const t = useTranslations("Layout.redirect");
  const { generateNewId } = useAppStore();
  const [isOrderPaidFor, setIsOrderPaidFor] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const id = useCartId();
  const router = useRouter();

  const eventEffect = useEvent(async () => {
    console.log(id, hasChecked);
    if (!id) return;
    const checkedOrder = await checkForPaidOrder(id);
    if (hasChecked && !checkedOrder) return setHasChecked(false);
    if (checkedOrder) {
      generateNewId();
      setIsOrderPaidFor(true);
      setHasChecked(true);
      router.push("/payment/success");
      toast.success(t("success"), {
        description: t("successDesc"),
      });
    } else {
      // NOTE: New cartId is not being generated here, becauss if the order was not paid for, the api deletes the previous entry when an order with the same cartId is created.
      toast.error(t("error"), { description: t("errorDesc") });
      router.push("/checkout");
    }
  });

  // The useEvent API has not yet been added to React,
  // so this is a temporary shim to make this sandbox work.
  // Taken from: https://stackoverflow.com/a/76514983/14922581
  // and modified to support typescript.

  function useEvent(fn: Function) {
    const ref = useRef<Function | null>(null);
    useInsertionEffect(() => {
      ref.current = fn;
    }, [fn]);
    return useCallback((...args: unknown[]) => {
      const f = ref.current;
      return f!(...args); // the variable SHOULD be a function since
    }, []);
  }

  useEffect(() => {
    // INFO: The reason this redirect handler is being used in the form of this mumbo jumbo useEffectEvent polyfil is as follows:
    // - Had the redirect handler been ran in this effect, id would have to be a dependency, since it would be used here.
    // - The handler updates the id before redirecting, so had the id been a dependency, the effect would run twice.
    // - On the second time the id would be completely new and obviously, it would not be found in the database so checkForPaidOrder would return false
    // - If it's false, the handler triggers ANOTHER redirect, this time to the checkout since the condition failed.
    // - Result: since the second redirect runs after the first, (duh) the user would be redirected to checkout and not have their cart cleared DESPITE having paid for their order.
    // - The react docs describe pretty much the same use case here: https://react.dev/learn/escape-hatches#separating-events-from-effects
    // - SOLUTION: as the docs say, use an event effect. Since it is only an experimental api, we need to use a polyfil
    // - Conclusion: react really needs the effect event api so developers don't have to use weird polyfils and write this ridiculous essay

    eventEffect();
  }, [eventEffect, id]); // WARN: This effect is supposed to run whenever the component loads, so theoreticaly whenever a user is redirected to the page, the function SHOULD run. HOPEFULLY there are no odd cases where the effect does not run or runs multiple times.

  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={"animate-spin h-[10vh] w-[10vh] stroke-primary"}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <h1 className="text-center">{t("checking")}</h1>
    </div>
  );
}

export default Redirect;
