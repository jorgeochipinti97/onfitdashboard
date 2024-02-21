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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";

import React, { useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";

export const TableOrders = ({ orders }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prevSelectedOrders) => {
      if (prevSelectedOrders.includes(orderId)) {
        // Si ya contiene el orderId, lo quitamos
        return prevSelectedOrders.filter((id) => id !== orderId);
      } else {
        // Si no contiene el orderId, lo agregamos
        return [...prevSelectedOrders, orderId];
      }
    });
  };

  const handleChangeEstado = async (orderId, nuevoEstado) => {
    try {
      // Llamada a la API para actualizar el estado de la orden
      const response = await axios.put(`/api/orders?_id=${orderId}`, {
        estado: nuevoEstado,
      });
      if (response.status === 200) {
        window.location.reload();
        // Aquí podrías actualizar el estado local o realizar otras acciones necesarias
      }
    } catch (error) {
      console.error("Error al actualizar la orden:", error);
    }
  };

  // function convertToCSV(orders, selectedOrders) {
  //   // Define your CSV headers based on the provided text
  //   const headers = [
  //     "Número de orden",
  //     "Email",
  //     "Fecha",

  //     "Estado del envío",
  //     "Nombre del comprador",
  //     "DNI / CUIT",
  //     "Teléfono",
  //     "Dirección",
  //     "Número",
  //     "Piso",
  //     "Localidad",
  //     "Ciudad",
  //     "Código postal",
  //     "Provincia o estado",
  //     "Medio de envío",
  //     "Nombre del producto",
  //     "Cantidad del producto",
  //     "SKU",
  //     "Identificador de la orden",
  //   ];

  //   // Map the orders to the CSV format
  //   const rows = orders
  //     .filter((order) => selectedOrders.includes(order._id)) // Filter only selected orders
  //     .map((order) => [
  //       // Map each order to the CSV row format
  //       order._id, // Assuming this is the property name in your order object
  //       order.email,
  //       order.date, // Format the date as needed
  //       order.estado,
  //       order.titular,
  //       order.dniTitular,
  //       order.phone,
  //       order.address,
  //       order.numberOfAddress,
  //       order.piso,
  //       order.localidad,
  //       order.ciudad,
  //       order.postalCode,
  //       order.provincia,
  //       "Urbano express | Entrega",

  //       order.orderItems
  //         .map((item) => `${item.title} - ${item.size}`)
  //         .join("; "), // Concatenate all product names
  //       order.orderItems.map((item) => item.quantity).join("; "), // Concatenate all quantities
  //       order.orderItems.map((item) => item.sku || "").join("; "),
  //       order.codGestion,
  //     ]);

  //   // Join the headers and rows to create the final CSV string
  //   return [headers.join(",")]
  //     .concat(rows.map((row) => row.join(",")))
  //     .join("\n");
  // }

  function convertToCSV(orders, selectedOrders) {
    // Define los encabezados CSV basados en el texto proporcionado
    const headers = [
      "Número de orden",
      "Email",
      "Fecha",
      "Estado del envío",
      "Nombre del comprador",
      "DNI / CUIT",
      "Teléfono",
      "Dirección",
      "Número",
      "Piso",
      "Localidad",
      "Ciudad",
      "Código postal",
      "Provincia o estado",
      "Medio de envío",
      "Nombre del producto",
      "Cantidad del producto",
      "SKU",
      "Identificador de la orden",
    ];
  
    let rows = [];
  
    // Filtra solo las órdenes seleccionadas y itera sobre ellas
    orders.filter(order => selectedOrders.includes(order._id)).forEach(order => {
      // Agrega una fila por orden con la información de la orden y el primer producto
      order.orderItems.forEach((item, index) => {
        // Si es el primer producto, incluye toda la información de la orden
        if (index === 0) {
          const firstProductRow = [
            order._id,
            order.email,
            order.date, // Asegúrate de formatear la fecha según sea necesario
            order.estado,
            order.titular,
            order.dniTitular,
            order.phone,
            order.address,
            order.numberOfAddress,
            order.piso,
            order.localidad,
            order.ciudad,
            order.postalCode,
            order.provincia,
            "Urbano express | Entrega",
            `${item.title} - ${item.size}`,
            item.quantity,
            item.sku || "",
            order.codGestion,
          ];
          rows.push(firstProductRow.join(","));
        } else {
          // Para productos subsiguientes, solo incluye los detalles del producto
          const subsequentProductRow = [
            "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", // Campos vacíos para la información de la orden
            `${item.title} - ${item.size}`,
            item.quantity,
            item.sku || "",
            "", // Campo vacío para el identificador de la orden, asumiendo que no se repite
          ];
          rows.push(subsequentProductRow.join(","));
        }
      });
    });
  
    // Une los encabezados con las filas para crear la cadena CSV final
    return [headers.join(",")].concat(rows).join("\n");
  }
  
  const handleExportSelected = () => {
    const csvString = convertToCSV(orders, selectedOrders);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "exported_orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-200">
      <div className="flex items-center justify-center">
        <Button className="my-10 text-white" onClick={handleExportSelected}>
          Exportar Seleccionados a CSV
        </Button>
      </div>
      <Table className="bg-white">
        <TableCaption>Lista de Ordenes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>-</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Total</TableHead>

            <TableHead>Titular</TableHead>
            <TableHead>Seguimiento</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha de Creación</TableHead>
            <TableHead>Fecha de Modificación</TableHead>
            <TableHead>-</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders &&
            orders.map((e) => (
              <TableRow key={e._id}>
                <TableCell className="font-medium">
                  <input
                    type="checkbox"
                    id={`checkbox-${e._id}`}
                    checked={selectedOrders.includes(e._id)}
                    onChange={() => handleCheckboxChange(e._id)} // Ajustado para no usar event
                  />
                </TableCell>
                <TableCell className="">
                  <p className="text-xs">{e._id} </p>
                </TableCell>
                <TableCell className="font-medium ">{e.total}</TableCell>
                <TableCell className="font-medium ">{e.titular}</TableCell>
                <TableCell className="font-medium">
                  <p className="text-xs">{e.codGestion}</p>
                </TableCell>
                <TableCell className="font-medium ">
                  <Select
                    key={e._id}
                    onValueChange={(nuevoEstado) =>
                      handleChangeEstado(e._id, nuevoEstado)
                    }
                    value={`${e.estado}`}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acreditado">Acreditado</SelectItem>
                      <SelectItem value="despachado">Despachado</SelectItem>
                      <SelectItem value="entregado">Entregado</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="">
                  <p className="text-xs">{formatDate(e.createdAt)}</p>
                </TableCell>{" "}
                <TableCell className="">
                  <p className="text-xs">{formatDate(e.updatedAt)}</p>
                </TableCell>{" "}
                <TableCell className="font-medium">
                  <Drawer className="max-h-[80vh]">
                    <DrawerTrigger className="bg-black rounded-md py-1 px-2 text-white text-xs">
                      Ver orden
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerDescription>
                          <div className="flex justify-around flex-col items-center">
                            <div>
                              <p className="mt-2">Total: ${e.total}</p>
                              <p className=" mt-2">Nombre: {e.titular}</p>
                              <p className=" mt-2">DNI: {e.dniTitular}</p>
                              <p className=" mt-2">Celular: {e.phone}</p>
                              <p className=" mt-2">
                                Dirección: {e.address} {e.numberOfAddress}{" "}
                                {e.piso && e.piso}, {e.localidad}, {e.ciudad}{" "}
                                {e.provincia}
                              </p>
                              <p className="mt-2">Email: {e.email}</p>
                            </div>
                            <div className="flex justify-center">
                              {e.orderItems.map((p) => (
                                <div
                                  className="flex flex-col mt-5  mx-2 items-center"
                                  key={p.title}
                                >
                                  <img
                                    className="w-[80px] rounded-xl"
                                    src={p.image}
                                  />
                                  <div className="flex-col flex">
                                    <p>Nombre: {p.title}</p>
                                    <p>Cantidad: {p.quantity}</p>
                                    <p>Talle: {p.size}</p>
                                    <p>SKU: {p.sku}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </DrawerDescription>
                      </DrawerHeader>
                    </DrawerContent>
                  </Drawer>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};
