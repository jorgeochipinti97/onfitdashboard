// components/DiscountCodeForm.js

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export const DiscountCodeForm = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    usos: 0,
    valor: 0,
    isPercentaje: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await axios.post("/api/discount", {
      ...formValues,
      sede: sede,
    });
    console.log(data);
  };

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
    "onfit"
  ];
  const [sede, setSede] = useState("obelisco");

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col bg-white justify-center"
    >
      <div className="w-12/12 flex justify-center mt-5">
        <div className="w-6/12">
          <Input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            placeholder="Nombre del Código"
          />
        </div>
      </div>
      <div className="w-12/12 flex justify-center mt-5">
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
      </div>
      <div className="w-12/12 flex justify-center mt-5">
        <div className="w-6/12">
          <label>Cantidad de usos</label>
          <Input
            type="number"
            name="usos"
            value={formValues.usos}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="w-12/12 flex justify-center mt-5">
        <div className="w-6/12">
          <label>Valor</label>
          <Input
            type="number"
            name="valor"
            value={formValues.valor}
            onChange={handleChange}
            placeh
            older="Valor"
          />
        </div>
      </div>
      <div className="w-12/12 flex justify-center mt-5">
        <div className="w-6/12">
          <label className="flex items-center">
            Es porcentaje:
            <input
              type="checkbox"
              name="isPercentaje"
              checked={formValues.isPercentaje}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>

      <div className="w-full flex justify-center my-5">
        <div className="w-6/12">
          <Button type="submit">Crear Código de Descuento</Button>
        </div>
      </div>
    </form>
  );
};
