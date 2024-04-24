import productoModel from "../models/producto.model.js";

export const registerProducto = async (req, res) => {
    const {
      nombre,
      codigo,
      descripcion,
      agregados,
      precio_base,
      cantidad_disponible,
      imagenes
    } = req.body;
  
    try {
      
        const nuevoProducto = new productoModel({
            nombre,
            codigo,
            descripcion,
            agregados,
            precio_base,
            cantidad_disponible,
            imagenes
        });
        const productoGuardado = await nuevoProducto.save();
        const prod = await res.json({
            nombre: productoGuardado.nombre,
            codigo: productoGuardado.codigo,
            descripcion: productoGuardado.descripcion,
            agregados: productoGuardado.agregados,
            precio_base: productoGuardado.precio_base,
            cantidad_disponible: productoGuardado.cantidad_disponible,
            imagenes: productoGuardado.imagenes,
        });
        return res.status(200).json({
          "resultado": "Exito",
          "mensaje": "Producto registrado",
          "datos": prod
        });
    } catch (error) {
      return res.status(401).json({
        "resultado": "Error",
        "mensaje": error.message
      });
    }
  };