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
  const [mes, selectMes] = useState("1");

  const filterOrdersByMonth = (orders, month, year) => {

    const filtered = orders.filter((order) => {
      const createdAt = new Date(order.createdAt);
      console.log(
        `Fecha de creación: ${createdAt}, Mes: ${createdAt.getMonth()}, Año: ${createdAt.getFullYear()}`
      );
      return createdAt.getMonth() === month && createdAt.getFullYear() === year;
    });


    return filtered;
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

  function convertToCSV(orders) {
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

    // Itera sobre el conjunto de órdenes proporcionado
    orders.forEach((order) => {
      // Agrega una fila por orden con la información de la orden y el primer producto
      order.orderItems.forEach((item, index) => {
        if (index === 0) {
          const firstProductRow = [
            order.codGestion,
            order.email,
            `"${formatDate(order.createdAt)}"`, // Asegúrate de formatear la fecha según sea necesario
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
            order._id,
          ];
          rows.push(firstProductRow.join(","));
        } else {
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

  const handleExportSelectedByMonth = (orders,month, year) => {
    const filteredOrders = filterOrdersByMonth(orders, month, year);
    console.log(filteredOrders);
    const fechaActual = new Date();
    const fechaFormateada = `${year}-${month + 1}-${fechaActual.getDate()}`; // Ajuste para que el mes sea legible (1-12)
    console.log(filteredOrders);
    const csvString = convertToCSV(filteredOrders);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    // Modificar el nombre de archivo para reflejar el filtrado por mes y año
    link.setAttribute("download", `tiendaonfit-${year}-${month + 1}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportSelected = () => {
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().split("T")[0];
    const csvString = convertToCSV(selectedOrders);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `tiendaonfit-${fechaFormateada}.csv`);
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
        <div>
          <Select onValueChange={(e) => selectMes(e)} value={mes}>
            <SelectTrigger className="w-[180px]">Elije el mes</SelectTrigger>
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
          <Button
            className="my-10 text-white"
            onClick={() => handleExportSelectedByMonth(orders, Number(mes) - 1, 2024)}
            >
            Exportar a CSV
          </Button>
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
