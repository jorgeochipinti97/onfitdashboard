import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";


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
