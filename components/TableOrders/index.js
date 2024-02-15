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

              <TableCell className="font-medium">{e.numberOfItems}</TableCell>

              <TableCell className="font-medium">{e.codGestion}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
