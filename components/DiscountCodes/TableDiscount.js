import React, { useState } from "react";
import { Input } from "../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Button } from "../ui/button";

export const TableDiscount = () => {
  const sucursales = [
    "obelisco",
    "almagro",
    "colegiales",
    "lomas de zamora",
    "flores",
    "plaza de mayo",
    "pilar",
    "olivos",
    "congreso",
    "saavedra",
    "la plata",
    "parque patricios",
    "quilmes",
    "maschwitz",
    "morón",
  ];
  const [sede, setSede] = useState("obelisco");
  const [valor, setValor] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isPercentaje, setIsPercentaje] = useState(false);

  const createCodes = async (cantidad) => {
    // Genera un array de códigos de descuento

    try {
      const discountCodes = Array.from({ length: quantity }, () => ({
        valor: valor,
        isPercentaje: isPercentaje,
        sede: sede,
      }));

      const responses = await Promise.all(
        discountCodes.map((discountCode) =>
          axios.post("/api/discount", discountCode)
        )
      );

      const codigos = responses.map((response) => response.data);
      codigos && handleExportSelected(codigos);
    } catch (error) {
      console.error("Error al crear códigos de descuento:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createCodes();
  };

  function convertToCSV(codes) {
    // Define los encabezados CSV basados en los campos de los códigos
    const headers = [
      "code",
      "sede",
      isPercentaje ? "% descuento" : "valor",
      "fecha",
    ];
    let rows = [headers.join(",")]; // Inicia con los encabezados como primera fila

    // Itera sobre cada código para construir las filas del CSV
    codes.forEach((code) => {
      const row = [
        code._id, // El código
        code.sede, // La sede
        code.valor, // El valor del descuento
        formatDate(code.createdAt), // La fecha, formateada
      ];
      rows.push(row.join(",")); // Une los elementos de la fila con comas y agrega la fila a las filas
    });

    // Une todas las filas con saltos de línea para formar el contenido CSV completo
    return rows.join("\n");
  }

  // Función auxiliar para formatear fechas en un formato legible
  // Puedes ajustar el formato de fecha según tus necesidades
  function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2); // Añade un cero inicial y toma los últimos 2 dígitos
    const day = ("0" + d.getDate()).slice(-2); // Añade un cero inicial y toma los últimos 2 dígitos
    return `${day}/${month}/${year}`; // Formato DD/MM/YYYY
  }

  const handleExportSelected = (codes) => {
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().split("T")[0];
    const csvString = convertToCSV(codes);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `codigos-tiendaOnfit-${fechaFormateada}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="w-full flex justify-center">
      <form className="bg-white w-6/12 p-5 rounded-xl" onSubmit={handleSubmit}>
        <Select
          onValueChange={(nuevoEstado) => setSede(nuevoEstado)}
          value={`${sede}`}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sucursales.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="cantidad de códigos"
          className="my-5"
          onChange={(e) => setQuantity(e.target.value)}
          value={quantity}
        />
        <Input
          onChange={(e) => setValor(e.target.value)}
          placeholder="valor"
          className="my-5"
          type="number"
          value={valor}
        />
        <div className="flex items-center ">
          <label className="mr-5 font-geist tracking-tighter">
            Es Porcentaje ?
          </label>
          <input
            type="checkbox"
            onChange={(e) => setIsPercentaje(e.target.checked)}
          />
        </div>
        <div className="mt-5">
          <Button type="submit">Enviar</Button>
        </div>
      </form>
    </div>
  );
};
