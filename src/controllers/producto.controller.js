import productoModel from "../models/producto.model.js";
import agregadoModel from "../models/agregado.model.js";

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
      const _agregadosValidados = [];
      if(agregados != undefined){
        if(agregados.length > 0){
          agregados.forEach(agreg => {
            let nuevoAgregado = new agregadoModel({
              nombre: agreg.nombre,
              precio: agreg.precio,
              minimo_selec: agreg.minimo_selec,
              maximo_select: agreg.maximo_select
            });
            try{
              let val = nuevoAgregado.validateSync();
              if(val){
                return res.status(401).json({
                  "resultado": "Error",
                  "mensaje": val
                });
              }
              _agregadosValidados.push(nuevoAgregado);
            }catch(err){

            }
          });
        }
      }
      const nuevoProducto = new productoModel({
          nombre,
          codigo,
          descripcion,
          agregados:_agregadosValidados,
          precio_base,
          cantidad_disponible,
          imagenes
      });
      const productoGuardado = await nuevoProducto.save();
      return res.status(200).json({
        "resultado": "Exito",
        "mensaje": "Producto registrado",
        "datos": productoGuardado
      });
    } catch (error) {
      return res.status(401).json({
        "resultado": "Error",
        "mensaje": error.message
      });
    }
  };

 