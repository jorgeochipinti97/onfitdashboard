// components/DiscountCodeForm.js

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";

export const DiscountCodeForm = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    usos: 0,
    valor: 0,
    isPercentage: false,
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
      sede: "onfit",
    });
    console.log(data);
  };

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
              className="ml-2"
              name="isPercentage"
              checked={formValues.isPercentage}
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
