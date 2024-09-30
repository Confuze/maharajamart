// "use client";
//
// import { ReactNode } from "react";
//
// import { type ReactNode, createContext, useRef, useContext } from 'react'
// import { useStore } from 'zustand'
//
// import { type IStore, useCartStore } from '@/src/lib/storage'
//
// export type CounterStoreApi = ReturnType<typeof useCartStore>
//
// export const CounterStoreContext = createContext<CounterStoreApi | undefined>(
//   undefined,
// )
//
// export interface CounterStoreProviderProps {
//   children: ReactNode
// }
//
// export const CounterStoreProvider = ({
//   children,
// }: CounterStoreProviderProps) => {
//   const storeRef = useRef<CounterStoreApi>()
//   if (!storeRef.current) {
//     storeRef.current = useCartStore()
//   }
//
//   return (
//     <CounterStoreContext.Provider value={storeRef.current}>
//       {children}
//     </CounterStoreContext.Provider>
//   )
// }

// export function StorageProvider({ children }: { children: ReactNode }) {
//   return <div>{children}</div>;
// }
