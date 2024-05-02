import * as XLSX from "xlsx";

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

import { formatPrice } from "@/app/utils/currency";
import dynamic from "next/dynamic";

export const TableOrders = ({ orders, password }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  const selectMes = (value) => {
    const monthNumber = parseInt(value, 10); // Convert string to number
    setSelectedMonth(monthNumber); // Update state with number
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
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

  const exportarAPdfYActualizarOrdenes = async () => {
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

    // Importa html2pdf dinámicamente
    try {
      const html2pdf = (await import("html2pdf.js")).default;

      // Generar y descargar el PDF
      html2pdf()
        .from(element)
        .set(opciones)
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
    } catch (error) {
      console.error("Error al cargar html2pdf:", error);
    }
  };

  function exportToExcel(data, fileName) {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to a worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Write the workbook and initiate download
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  function handleExport(mes) {
    const monthNumber = mes;

    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);



      return (
        !isNaN(orderDate.getTime()) && orderDate.getMonth() + 1 === monthNumber
      );
    });



    const data = filteredOrders.map((order) => ({
      "Número de orden": order.codGestion,
      "Nombre del comprador": order.titular,
      Fecha: formatDate(order.createdAt),
      "Estado del envío": order.estado,
      "Codigo de descuento": order.discountCode ? order.discountCode : "-",
      Total: order.discountPrice ? order.discountPrice : order.total,
      Productos: order.orderItems.map((item) => item.title).join(", "),
      Email: order.email,
      DNI: order.dniTitular,
      celular: order.phone,
      Direccion: order.address,
      Numero: order.numberOfAddress,
      Piso: order.piso,
      LocalidadL: order.localidad,
      Ciudad: order.ciudad,
      "Codigo postal": order.postalCode,
      Provincia: order.provincia,
    }));
    exportToExcel(data, `Tienda Onfit - ${monthNames[selectedMonth]} - 2024`);
  }
  const monthNames = [
    "", // Index 0 - no month
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return (
    <div className="bg-slate-200">
      <div className="flex items-center justify-around py-10">
        <div>
          <div className="w-fit bg-white mb-5 rounded-xl">
            <Select onValueChange={selectMes}>
              <SelectTrigger className="w-[180px]">
                {selectedMonth
                  ? `${monthNames[selectedMonth]}`
                  : "Elije el mes"}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Enero</SelectItem>
                <SelectItem value="2">Febrero</SelectItem>
                <SelectItem value="3">Marzo</SelectItem>
                <SelectItem value="4">Abril</SelectItem>
                <SelectItem value="5">Mayo</SelectItem>
                <SelectItem value="6">Junio</SelectItem>
                <SelectItem value="7">Julio</SelectItem>
                <SelectItem value="8">Agosto</SelectItem>
                <SelectItem value="9">Septiembre</SelectItem>
                <SelectItem value="10">Octubre</SelectItem>
                <SelectItem value="11">Noviembre</SelectItem>
                <SelectItem value="12">Diciembre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={()=>handleExport(selectedMonth)}>EXPORTAR A EXCEL</Button>
          {/* <Button
            className="my-10 text-white"
            onClick={() =>
              handleExportSelectedToExcel(orders, Number(mes) - 1, 2024)
            }
          >
            Exportar a EXCEL
          </Button> */}
        </div>
        {password != "onfit" && (
          <Button
            className="my-10 text-white"
            onClick={exportarAPdfYActualizarOrdenes}
          >
            Imprimir etiquetas
          </Button>
        )}
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
                <TableCell className="font-medium ">
                  {formatPrice(e.total)}
                </TableCell>
                <TableCell className="font-medium ">{e.titular}</TableCell>
                <TableCell className="font-medium">
                  <p className="text-xs">{e.codGestion}</p>
                </TableCell>
                <TableCell className="font-medium ">
                  <Select
                    disabled={password == "onfit"}
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
                      <SelectItem value="nosotros">
                        Entrega a cargo de nosotros
                      </SelectItem>
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
                              {e.cuotas && (
                                <p className="mt-2">cuotas: {e.cuotas}</p>
                              )}

                              {e.discountCode && (
                                <p className="mt-2">
                                  Código de descuento: {e.discountCode}
                                </p>
                              )}
                              <p className="mt-2">Token: {e.token}</p>
                              <p className="mt-2">
                                Total: {formatPrice(e.total)}
                              </p>
                              {e.discountPrice && (
                                <p className="mt-2">
                                  Precio con descuento:{" "}
                                  {formatPrice(e.discountPrice)}
                                </p>
                              )}
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
                      <p className="mt-2 font-geist font-bold text-xs">
                        Orden: {order.codGestion}
                      </p>
                      <p className="mt-2 font-mono font-bold text-xs">
                        Realizada: {formatDate(order.createdAt)}
                      </p>
                      <div className="bg-black h-1 rounded-full my-4 w-full" />
                      <div className=" flex justify-between">
                        <p className=" font-geist font-bold text-xs">Total: </p>
                        <p className=" font-geist font-bold text-xs">
                          {formatPrice(order.total)}{" "}
                        </p>
                      </div>
                      <div className="bg-black h-1 rounded-full my-4 w-full" />
                      <p className=" mt-2 uppercase font-bold font-geist">
                        {" "}
                        {order.titular}
                      </p>
                      <p className=" mt-2 uppercase font-mono text-xs">
                        {" "}
                        {order.dniTitular}
                      </p>
                      <p className=" mt-2 uppercase font-mono text-xs">
                        {" "}
                        {order.phone}
                      </p>
                      <p className=" mt-2 uppercase font-mono text-xs">
                        {order.address} {order.numberOfAddress}{" "}
                        {order.piso && order.piso}, {order.localidad},{" "}
                        {order.ciudad} {order.provincia}
                      </p>
                      <p className="mt-2 uppercase font-mono text-xs">
                        {order.email}
                      </p>
                    </div>
                    <div className="bg-black h-1 rounded-full my-4 w-full" />
                    <p className="font-geist font-bold tracking-tighter text-2xl">
                      Productos
                    </p>
                    <div className="flex justify-start w-full flex-col items-start ">
                      {order.orderItems.map((p) => (
                        <div className="flex w-full  flex-col" key={p.title}>
                          <div className="flex-col flex mt-5">
                            <p className="font-mono capitalize font-bold text-xs">
                              {" "}
                              {p.title} {p.size} - ({p.quantity})
                            </p>
                            <p className="font-mono capitalize font-bold text-xs">
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
