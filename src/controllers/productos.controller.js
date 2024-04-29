import productoModel from "../models/producto.model.js";

export const obtenerProductos = async (req, res) => {
    try {
      const productos = await productoModel.find();
      res.json(productos);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Productos no disponibles o existentes" });
    }
  };