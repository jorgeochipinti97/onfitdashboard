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

const TableProducts = ({ products }) => {

  const handleDelete = async (product) => {
    try {
      // Asegúrate de que 'product' contiene un campo '_id'
      const response = await axios.delete("/api/product", {
        data: { _id: product._id },
      });
      console.log("Producto eliminado exitosamente", response.data);
      // Aquí podrías agregar lógica adicional para actualizar la UI tras la eliminación exitosa
    } catch (error) {
      console.error(
        "Error al eliminar el producto:",
        error.response ? error.response.data : error
      );
      // Manejar el error, posiblemente mostrar un mensaje al usuario
    }
  };

  return (
    <Table className="bg-white">
      <TableCaption>Lista de tus productos.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">Nombre</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Imagen</TableHead>
          <TableHead className="">Precio</TableHead>
          <TableHead className="">Editar</TableHead>
          <TableHead className="">Eliminar</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products &&
          products.map((e) => (
            <TableRow key={e._id}>
              <TableCell className="font-medium tracking-tighter">{e.titulo}</TableCell>
              <TableCell className="font-medium tracking-tighter ">{e.categoria}</TableCell>
              <TableCell className="font-medium tracking-tighter">
                <img src={e.images[0]} alt="" className="w-[50px]" />
              </TableCell>
              <TableCell className="font-medium tracking-tighter">{formatPrice(e.precio)}</TableCell>

              <TableCell>
                <Drawer className="max-h-[80vh]">
                  <DrawerTrigger>
                    <svg
                      className="cursor-pointer"
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
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerDescription>
                        <ProductForm existingProduct={e} />
                      </DrawerDescription>
                    </DrawerHeader>
                  </DrawerContent>
                </Drawer>
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <svg
                      className="cursor-pointer"
                      width={35}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 7v11a2 2 0 002 2h8a2 2 0 002-2V7M6 7H5m1 0h2m10 0h1m-1 0h-2m-6 4v5m4-5v5M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7h8"
                      ></path>
                    </svg>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Estas seguro de eliminar el producto?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta decisión será permanente
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(e)}>
                        {" "}
                        Continuar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default TableProducts;
