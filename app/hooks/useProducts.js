'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';

// Hook personalizado para cargar productos desde /api/product
const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Realiza la petición GET a la ruta /api/product
        const response = await axios.get('/api/product');
        // Actualiza el estado con los productos obtenidos
        setProducts(response.data);
      } catch (error) {
        // En caso de error, actualiza el estado con el error
        setError(error);
      } finally {
        // Finalmente, actualiza el estado de carga a false
        setLoading(false);
      }
    };

    // Llama a la función fetchProducts
    fetchProducts();
  }, []); // El array vacío indica que este efecto se ejecuta solo una vez, al montar el componente

  return { products, loading, error };
};

export default useProducts;
