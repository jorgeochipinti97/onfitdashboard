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
import { Input } from "@/components/ui/input";
import { TableOrders } from "@/components/TableOrders";
import { useEffect, useState } from "react";
import gsap, { Power1 } from "gsap";
import { TableDiscount } from "@/components/DiscountCodes/TableDiscount";

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
  const [password, setPassword] = useState("");
  useEffect(() => {
    password == "royer" &&
      gsap.to(".dashboard", {
        opacity: 0,
        ease: Power1.easeIn,
      });
    password == "royer" &&
      gsap.to(".dashboard", {
        delay: 0.3,
        display: "none",
        ease: Power1.easeIn,
      });
    password == "royer" &&
      gsap.to(".royer", {
        delay: 0.5,
        display: "flex",
        ease: Power1.easeIn,
      });
    password == "royer" &&
      gsap.to(".royer", {
        delay: 1,
        opacity: 1,
        ease: Power1.easeIn,
      });

    password == "royer" &&
      gsap.to(".ementors", {
        delay: 0.3,
        display: "none",
        ease: Power1.easeIn,
      });
    password == "ementors" &&
      gsap.to(".ementors", {
        delay: 0.5,
        display: "flex",
        ease: Power1.easeIn,
      });
    password == "ementors" &&
      gsap.to(".ementors", {
        delay: 1,
        opacity: 1,
        ease: Power1.easeIn,
      });

    password == "ementors" &&
      gsap.to(".dashboard", {
        delay: 0.5,
        display: "none",
        ease: Power1.easeIn,
      });
  }, [password]);
  return (
    <>
      <div className="bg-black h-screen dashboard" style={{}}>
        <div className="flex justify-center h-full items-center">
          <div className="w-11/12 md:w-3/12">
            <Input
              className="bg-white"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div
        className="royer bg-black min-h-screen flex-col  items-center pt-10 justify-start"
        style={{ display: "auto", opacity: 1 }}
      >
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
            <TabsTrigger value="discount">Codigos de descuento</TabsTrigger>
          </TabsList>
          <TabsContent value="productos">
            <TableProducts products={products} />
          </TabsContent>
          <TabsContent value="ordenes">
            <TableOrders orders={orders} />
          </TabsContent>
          <TabsContent value="discount">
            <TableDiscount />
          </TabsContent>
        </Tabs>
      </div>
      <div
        className="ementors bg-black min-h-screen flex-col  items-center pt-10 justify-start"
        style={{ display: "none", opacity: 0 }}
      >
        <TableOrders orders={orders} />
      </div>
    </>
  );
}
