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

import React from "react";
import dynamic from "next/dynamic";
import axios from "axios";

export const TableOrders = ({ orders }) => {
  return (
    <Table className="bg-white">
      <TableCaption>Lista de Ordenes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">ID</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Items</TableHead>
          <TableHead className="">Seguimiento</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders &&
          orders.map((e) => (
            <TableRow key={e._id}>
              <TableCell className="font-medium">{e._id}</TableCell>

              <TableCell className="font-medium ">{e.total}</TableCell>

              <TableCell className="font-medium">
                <Drawer className="max-h-[80vh]">
                  <DrawerTrigger><span className="px-2 py-1 bg-black text-white rounded-full">{e.numberOfItems}</span></DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerDescription>
                        <div className="flex justify-around">
                          {e.orderItems.map((p) => (
                            <div className="flex flex-col items-center" key={p.title}>
                              <img className="w-[150px]" src={p.image} />
                              <p>{p.title}</p>
                              <p>{p.quantity}</p>
                              <p>{p.size}</p>
                            </div>
                          ))}
                        </div>
                      </DrawerDescription>
                    </DrawerHeader>
                  </DrawerContent>
                </Drawer>
              </TableCell>

              <TableCell className="font-medium">{e.codGestion}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
