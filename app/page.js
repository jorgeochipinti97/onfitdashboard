"use client";
import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useProducts from "./hooks/useProducts";
import dynamic from "next/dynamic";
import { useOrders } from "./hooks/useOrders";
import { useEffect } from "react";
import { TableOrders } from "@/components/TableOrders";

const ProductForm = dynamic(
  () => import("@/components/ProductForm"),
  { ssr: false } // Solo si necesitas deshabilitar SSR para este componente.
);
const TableProducts = dynamic(
  () => import("@/components/TableProducts"),
  { ssr: false } // Solo si necesitas deshabilitar SSR para este componente.
);

export default function Home() {
  const { products } = useProducts();
  const { orders } = useOrders();

  useEffect(() => {
    orders && console.log(orders);
  }, [orders]);

  return (
    <>
      <div className="bg-black min-h-screen flex-col flex items-center pt-10 justify-start">
        <Drawer className="max-h-[80vh]">
          <DrawerTrigger className="flex items-center mb-10 bg-white p-2 rounded-xl">
            <svg
              width={30}
              className="mr-3 "
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                fill="#000"
                fillRule="evenodd"
                d="M12 22c-4.714 0-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464C22 4.93 22 7.286 22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22zm0-13.75a.75.75 0 01.75.75v2.25H15a.75.75 0 010 1.5h-2.25V15a.75.75 0 01-1.5 0v-2.25H9a.75.75 0 010-1.5h2.25V9a.75.75 0 01.75-.75z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span>Crear Producto</span>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerDescription>
                <ProductForm />
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
        <Tabs defaultValue="productos" className="w-[95vw]">
          <TabsList className=" w-full">
            <TabsTrigger value="productos">Productos</TabsTrigger>
            <TabsTrigger value="ordenes">Ordenes</TabsTrigger>
            <TabsTrigger value="datos">Datos</TabsTrigger>
          </TabsList>
          <TabsContent value="productos">
            <TableProducts products={products} />
          </TabsContent>
          <TabsContent value="ordenes">
            <TableOrders orders={orders} />
          </TabsContent>
          <TabsContent value="datos">
            <span className="text-white">datos </span>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
