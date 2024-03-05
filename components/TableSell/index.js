import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { formatPrice } from "@/app/utils/currency";
const ProductForm = dynamic(
  () => import("@/components/ProductForm"),
  { ssr: false } // Solo si necesitas deshabilitar SSR para este componente.
);

const TableSell = ({ products }) => {
  return (
    <Table className="bg-white">
      <TableCaption>Lista de tus productos.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">Imagen</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Cantidad Vendida</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products &&
          products.map((e) => (
            <TableRow key={e._id}>
              <TableCell className="font-medium tracking-tighter">
                <img src={e.image} alt="" className="w-[50px]" />
              </TableCell>
              <TableCell className="font-medium tracking-tighter">
                {e.titulo}
              </TableCell>
              <TableCell className="font-medium tracking-tighter ">
                {e.totalVendido}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default TableSell;
