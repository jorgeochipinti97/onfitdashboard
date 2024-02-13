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

  return (
    <>
       

      <div className="bg-black h-screen flex-col flex items-center pt-10 justify-start">
        <Drawer>
          <DrawerTrigger className="flex items-center mb-10 bg-white p-2 rounded-xl">

              <svg
                className="cursor-pointer mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                width={30}
              >
                <g
                  stroke="#292D32"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                >
                  <path d="M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2"></path>
                  <path
                    strokeMiterlimit="10"
                    d="M16.04 3.02L8.16 10.9c-.3.3-.6.89-.66 1.32l-.43 3.01c-.16 1.09.61 1.85 1.7 1.7l3.01-.43c.42-.06 1.01-.36 1.32-.66l7.88-7.88c1.36-1.36 2-2.94 0-4.94-2-2-3.58-1.36-4.94 0zM14.91 4.15a7.144 7.144 0 004.94 4.94"
                  ></path>
                </g>
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
        <Tabs defaultValue="productos" className="w-[80vw]">
          <TabsList className=" w-full">
            <TabsTrigger value="productos">Productos</TabsTrigger>
            <TabsTrigger value="ordenes">Ordenes</TabsTrigger>
            <TabsTrigger value="datos">Datos</TabsTrigger>
          </TabsList>
          <TabsContent value="productos">
            <TableProducts products={products} />
          </TabsContent>
          <TabsContent value="ordenes">
            <span className="text-white">ordenes </span>
          </TabsContent>
          <TabsContent value="datos">
            <span className="text-white">datos </span>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
