import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import html2pdf from "html2pdf.js";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReactDOM from "react-dom";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "../ui/separator";
import { formatPrice } from "@/app/utils/currency";

export const TableOrders = ({ orders }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [date, setDate] = useState(new Date());
  const [end, setEnd] = useState(new Date());

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

  const exportarAPdfYActualizarOrdenes = () => {
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().split("T")[0];
    const element = document.querySelector(".a4-container");

    // Configurar opciones de html2pdf
    const opciones = {
      margin: [5, 5],
      filename: `tiendaonfit-${fechaFormateada}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 1, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Generar y descargar el PDF
    html2pdf()
      .set(opciones)
      .from(element)
      .save()
      .then(() => {
        // Una vez descargado el PDF, actualizar el estado de las órdenes
        orders
          .filter((order) => selectedOrders.includes(order._id))
          .forEach((order) => {
            handleChangeEstado(order._id, "impreso").catch(console.error);
          });
      })
      .catch(console.error);
  };

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
    orders
      .filter((order) => selectedOrders.includes(order._id))
      .forEach((order) => {
        // Agrega una fila por orden con la información de la orden y el primer producto
        order.orderItems.forEach((item, index) => {
          // Si es el primer producto, incluye toda la información de la orden
          if (index === 0) {
            const firstProductRow = [
              order._id,
              order.email,
              order.createdAt, // Asegúrate de formatear la fecha según sea necesario
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
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "", // Campos vacíos para la información de la orden
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
      <div className="flex items-center justify-around py-10">
        <Button className="my-10 text-white" onClick={handleExportSelected}>
          Exportar Seleccionados a CSV
        </Button>
        <Button
          className="my-10 text-white"
          onClick={exportarAPdfYActualizarOrdenes}
        >
          Imprimir etiquetas
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
                <TableCell className="font-medium ">{formatPrice(e.total)}</TableCell>
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
                      <SelectItem value="impreso">Impreso</SelectItem>
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
                              <p className="mt-2">Token: {e.token}</p>
                              <p className="mt-2">Total: {formatPrice(e.total)}</p>
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

      <div className="a4-container ">
        <div className="grid grid-cols-2">
          {orders
            .filter((order) => selectedOrders.includes(order._id))
            .map((order, index) => (
              <div className="w-full   flex justify-center" key={index}>
                <div className=" w-12/12 p-3 mx-2 border-2 border-black border-dashed rounded-xl	">
                  <div className="flex justify-around flex-col items-center">
                    <div>
                      <p className="mt-2 font-geist font-bold text-md">
                        Orden: {order.codGestion}
                      </p>
                      <p className="mt-2 font-mono font-bold text-md">
                        Realizada: {formatDate(order.createdAt)}
                      </p>
                      <div className="bg-black h-1 rounded-full my-4 w-full" />
                      <div className=" flex justify-between">
                        <p className=" font-geist font-bold">Total: </p>
                        <p className=" font-geist font-bold">{formatPrice(order.total)} </p>
                      </div>
                      <div className="bg-black h-1 rounded-full my-4 w-full" />
                      <p className=" mt-2 uppercase font-bold font-geist">
                        {" "}
                        {order.titular}
                      </p>
                      <p className=" mt-2 uppercase font-mono">
                        {" "}
                        {order.dniTitular}
                      </p>
                      <p className=" mt-2 uppercase font-mono">
                        {" "}
                        {order.phone}
                      </p>
                      <p className=" mt-2 uppercase font-mono">
                        {order.address} {order.numberOfAddress}{" "}
                        {order.piso && order.piso}, {order.localidad},{" "}
                        {order.ciudad} {order.provincia}
                      </p>
                      <p className="mt-2 uppercase font-mono">{order.email}</p>
                    </div>
                    <div className="bg-black h-1 rounded-full my-4 w-full" />
                    <p className="font-geist font-bold tracking-tighter text-2xl">
                      Productos
                    </p>
                    <div className="flex justify-start w-full flex-col items-start ">
                      {order.orderItems.map((p) => (
                        <div className="flex w-full  flex-col" key={p.title}>
                          <div className="flex-col flex mt-5">
                            <p className="font-mono capitalize font-bold">
                              {" "}
                              {p.title} - ({p.quantity})
                            </p>
                            <p className="font-mono capitalize font-bold">
                              SKU: {p.sku}
                            </p>
                          </div>
                          <div className="bg-black h-1 rounded-full my-4 w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// EtiquetaOrden.js
