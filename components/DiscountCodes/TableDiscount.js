import React, { useState } from "react";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Button } from "../ui/button";
import { DiscountCodeForm } from "../DiscountForm";

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

  const [isPercentaje, setIsPercentaje] = useState(false);

  const BATCH_SIZE = 50; // Define el tamaño de cada lote

  const createCodes = async (cantidad) => {
    try {
      const discountCodes = Array.from({ length: cantidad }, () => ({
        valor: valor,
        isPercentaje: isPercentaje,
        sede: sede,
        isUsed: false,
      }));

      // Divide los códigos en lotes para enviarlos por separado
      for (let i = 0; i < discountCodes.length; i += BATCH_SIZE) {
        const batch = discountCodes.slice(i, i + BATCH_SIZE);

        const responses = await Promise.all(
          batch.map((discountCode) => axios.post("/api/discount", discountCode))
        );

        const codigos = responses.map((response) => response.data);
        codigos && handleExportSelected(codigos);
      }
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
    <div>
      <DiscountCodeForm />
    </div>
  );
};
