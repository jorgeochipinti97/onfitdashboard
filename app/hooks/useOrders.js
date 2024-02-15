import { useEffect, useState } from "react";
import axios from "axios";

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getOrders() {
      try {
        let url = "/api/orders"; //
        const response = await axios.get(url);
        const orders_ = response.data;
        console.log(response);
        setOrders(orders_);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false); // Indicar que la carga ha finalizado
      }
    }

    getOrders();
  }, []);

  return { orders, isLoading };
}
