import React, { useState, useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Importa los estilos CSS de React Quill
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

const ProductForm = ({ existingProduct }) => {
  const [imagesArray, setImagesArray] = useState(existingProduct?.images || []);
  const [categoria, setCategoria] = useState(existingProduct?.categoria || "");

  const [subcategoria, setSubcategoria] = useState(
    existingProduct?.subcategoria || ""
  );
  const [descripcion, setDescripcion] = useState(
    existingProduct?.descripcion || ""
  );
  const [slug, setSlug] = useState(existingProduct?.slug | "");

  const [product, setProduct] = useState({
    tags: "",
    titulo: "",
    descripcion: "",
    precio: 0,
    precioDescuento: 0,
    productosRelacionados: "",
    talles: [{ nombre: "", stock: "" }],
  });

  const fileTypes = ["JPG", "PNG", "GIF", "JPEG", "AVIF", "WEBP"];

  const getNewSlug = (title) => {
    try {
      const newSlug =
        title
          .trim()
          .replaceAll(" ", "_")
          .replaceAll("'", "")
          .toLocaleLowerCase() || "";
      setSlug(newSlug);
    } catch (err) {
      console.log(err);
    }
  };
  // Cargar datos del producto existente si se proporciona
  useEffect(() => {
    console.log(existingProduct);
    if (existingProduct) {
      setProduct({
        ...existingProduct,
        tags: existingProduct.tags.join(", "), // Suponiendo que 'tags' y 'productosRelacionados' son arrays
        productosRelacionados: existingProduct.productosRelacionados.join(", "),
        talles:
          existingProduct.talles.length > 0
            ? existingProduct.talles
            : [{ nombre: "", stock: "" }],
      });
    }
  }, [existingProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "precio" || name == "precioDescuento") {
      setProduct({ ...product, [name]: Number(value) });
    } else {
      setProduct({ ...product, [name]: value });
    }

    name == "titulo" && getNewSlug(value);
  };

  const handleTalleChange = (index, e) => {
    const newTalles = product.talles.map((talle, talleIndex) => {
      if (index === talleIndex) {
        return { ...talle, [e.target.name]: e.target.value };
      }
      return talle;
    });
    setProduct({ ...product, talles: newTalles });
  };

  const getSubcategorias = () => {
    switch (categoria) {
      case "hombres":
        return [
          "remera_deportiva",
          "remera_oversize",
          "musculosa",
          "buzo",
          "short",
          "pantalon",
          "medias",
          "campera",
        ];
      case "mujeres":
        return [
          "remera_deportiva",
          "remera_oversize",
          "top",
          "buzo",
          "short",
          "calza",
          "medias",
          "campera",
        ];
      case "equipamiento":
        return ["fitness", "maquinas"];
      case "suplementos":
        return ["proteina", "creatina"];
      case "accesorios":
        return ["accesorios"];

      default:
        return [];
    }
  };

  const addTalle = () => {
    setProduct({
      ...product,
      talles: [...product.talles, { nombre: "", stock: "" }],
    });
  };

  const handleChange = async (files) => {
    try {
      // Asegúrate de que 'files' sea tratado como un array
      const fileList = Array.isArray(files) ? files : [files];

      for (const file of fileList) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dwtnrs4ix/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          setImagesArray((prevImagesArray) => [
            ...prevImagesArray,
            data.secure_url,
          ]);
          console.log(data.secure_url);
          // Asumiendo que setUploadData es parte de tu estado y quieres actualizarlo también
          // setUploadData((prevUploadData) => [...prevUploadData, data]);
        } else {
          console.error("Error al cargar la imagen en Cloudinary");
        }
      }
    } catch (er) {
      console.error("Error en la carga de archivos", er);
    }
  };

  // Función ficticia para simular la carga de imágenes a Cloudinary
  // Deberías reemplazarla con tu lógica de carga real

  const removeImage = (index) => {
    setImagesArray((currentImages) =>
      currentImages.filter((_, i) => i !== index)
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparar el objeto de producto para enviar
    const productToSubmit = {
      ...product,
      categoria,
      slug: product.titulo
        .trim()
        .replaceAll(" ", "_")
        .replaceAll("'", "")
        .toLocaleLowerCase(),
      subcategoria,
      descripcion, // Asumiendo que ReactQuill devuelve HTML como string
      images: imagesArray, // Asegúrate de que este campo coincida con el esperado por tu modelo
      tags: product.tags.split(",").map((tag) => tag.trim()), // Convertir string en array
      productosRelacionados: product.productosRelacionados
        .split(",")
        .map((producto) => producto.trim()), // Convertir string en array si es necesario
      // Asumiendo que 'talles' ya está en el formato correcto y no necesita ser modificado
    };

    console.log("Producto a enviar:", productToSubmit);

    // Aquí deberías enviar el objeto productToSubmit a tu backend
    // usando fetch/axios o cualquier método que prefieras.
    try {
      const response = await fetch("/api/product", {
        method: existingProduct ? "PUT" : "POST", // Asumiendo que usas PUT para actualizar y POST para crear
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productToSubmit),
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito/error
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      // Manejar el error (por ejemplo, mostrar un mensaje al usuario)
    }
  };

  return (
    <ScrollArea className='h-[80vh]'>
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[90vh]">
      {/* Título */}
      <div className="w-full justify-around flex">
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          id="titulo"
          required
          value={product.titulo}
          onChange={handleInputChange}
          className=" w-fit focus:ring-indigo-500 focus:border-indigo-500 block  shadow-sm sm:text-sm border-gray-800 border p-2 rounded-md"
        />
        <input
          type="text"
          name="tags"
          id="tags"
          value={product.tags}
          onChange={handleInputChange}
          placeholder="Ejemplo: tag1, tag2"
          className=" w-fit focus:ring-indigo-500 focus:border-indigo-500 block  shadow-sm sm:text-sm border-gray-800 border p-2 rounded-md"
        />
        <div>
          <select
            name="categoria"
            id="categoria"
            required
            placeholder="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className=" block w-fit pl-3 pr-10 py-2 text-base mr-2 border-gray-800 border p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Seleccione una categoría</option>
            <option value="hombres">Hombres</option>
            <option value="mujeres">Mujeres</option>
            <option value="equipamiento">Equipamiento</option>
            <option value="suplementos">Suplementos</option>
            <option value="accesorios">Accesorios</option>
          </select>
        </div>
        <div style={{ }}>
          <select
            name="subcategoria"
            id="subcategoria"
            placeholder="subcategoria"
            required
            value={ subcategoria}
            onChange={(e) => setSubcategoria(e.target.value)}
            className=" mx-2 block w-full pl-3 pr-10 py-2 text-base border-gray-800 border p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Seleccione una subcategoría</option>
            {getSubcategorias().map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}

      {/* Descripción */}
      <div>
        <ReactQuill
          theme="snow"
          value={descripcion}
          onChange={setDescripcion}
          modules={ProductForm.modules}
          formats={ProductForm.formats}
          bounds={".app"}
          placeholder="Escribe la descripción aquí..."
        />
      </div>

      {/* Precio */}

      {/* Categoría */}
      <div className="flex ">
        <div>
          <label>Precio</label>
          <input
            type="number"
            name="precio"
            id="precio"
            required
            placeholder="Precio"
            value={product.precio}
            onChange={handleInputChange}
            className=" mx-2  focus:ring-indigo-500 focus:border-indigo-500 block w-fit shadow-sm sm:text-sm border-gray-800 border p-2 rounded-md"
            />
        </div>
      </div>
      <div className="flex ">
        <div>
            <label>Precio con descuento</label>
          <input
            type="number"
            name="precioDescuento"
            id="precioDescuento"
            required
            placeholder="precio de descuento"
            value={product.precioDescuento}
            onChange={handleInputChange}
            className=" mx-2  focus:ring-indigo-500 focus:border-indigo-500 block w-fit shadow-sm sm:text-sm border-gray-800 border p-2 rounded-md"
          />
        </div>
      </div>
      <div className="flex">
        {product &&
          product.talles.map((talle, index) => (
            <div key={index} className="w-fit flex flex-col">
              <div className="">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Talle"
                  id={`talle-nombre-${index}`}
                  value={talle.nombre}
                  onChange={(e) => handleTalleChange(index, e)}
                  className=" mb-2 w-fit focus:ring-indigo-500 focus:border-indigo-500 block  shadow-sm sm:text-sm border-gray-800 border p-2 rounded-md"
                />
              </div>
              <div>
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  id={`talle-stock-${index}`}
                  value={talle.stock}
                  onChange={(e) => handleTalleChange(index, e)}
                  className=" focus:ring-indigo-500 focus:border-indigo-500 block w-fit shadow-sm sm:text-sm border-gray-800 border p-2 rounded-md"
                />
              </div>
            </div>
          ))}
      </div>
      <button
        type="button"
        onClick={addTalle}
        className="mt-2 mb-4 inline-flex justify-center py-2 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Añadir Talle
      </button>

      {/* Imágenes */}
      <div className="flex ">
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
        />
        <div className="flex-1 flex w-full  ">
          {imagesArray &&
            imagesArray.map((e, index) => (
              <div
                key={e}
                className="flex flex-col items-center justify-center mx-3"
              >
                <img src={e} alt="" className="mx-2 w-[50px]" />
                <Button
                  size={"sm"}
                  className="mt-2"
                  onClick={() => removeImage(index)}
                >
                  Eliminar{" "}
                </Button>
              </div>
            ))}
        </div>
      </div>
      <div></div>
      {/* Botón de envío */}
      <div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {existingProduct ? "Actualizar Producto" : "Crear Producto"}
        </button>
      </div>
    </form>
    </ScrollArea>
  );
};

export default ProductForm;
