import productoModel from "../models/producto.model.js";

export const register = async (req, res) => {
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
      
        const nuevoProducto = new usuarioModel({
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
        console.log(prod);
    } catch (error) {
      console.log(error);
    }
  };