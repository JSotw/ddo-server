import productoModel from "../models/producto.model.js";
import agregadoModel from "../models/agregado.model.js";

export const obtenerProductos = async (req, res) => {
    try {
      let productos;
      if(req.params.estado != undefined){
        productos = await productoModel.find({activo: req.params.estado});
      }else{
        productos = await productoModel.find();
      }
      res.json(productos);
    } catch (error) {
      return res
        .status(500)
        .json(error.message);
    }
  };
  
export const crearProducto = async (req, res) => {
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
      const productoEncontrado = await productoModel.findOne({ codigo });
      if(!productoEncontrado){
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
                    "mensaje": val
                  });
                }
                _agregadosValidados.push(nuevoAgregado);
              }catch(err){
                return res.status(401).json(err.message);
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
        return res.status(200).json(productoGuardado);
      }else{
        return res.status(401).json("Producto ya registrado");
      }
    } catch (error) {
      return res.status(401).json(error.message);
    }
  };
  export const obtenerProducto = async (req, res) => {
    try {
      const producto = await productoModel.findOne({ _id: req.params.id });
      if (!producto)
        return res.status(404).json("No se encuentra el producto");
      res.json(producto);
    } catch (error) {
      return res.status(404).json("Producto no encontrado");
    }
  };
  export const obtenerProductoPorCodigo = async (req, res) => {
    try {
      const producto = await productoModel.findOne({ codigo: req.params.codigo });
      if (!producto)
        return res.status(404).json("No se encuentra el producto");
      res.json(producto);
    } catch (error) {
      return res.status(404).json("Producto no encontrado");
    }
  };
  export const actualizarProducto = async (req, res) => {
    const id = req.params.id;
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
      const productoEncontrado = await productoModel.findById(id);
      if(productoEncontrado){
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
                return res.status(401).json({
                  "resultado": "Error",
                  "mensaje": err.message
                });
              }
            });
          }
        }
        const producto = await productoModel.findByIdAndUpdate({_id: id}, {
          $set:{
            nombre: nombre,
            codigo: codigo,
            descripcion: descripcion,
            agregados: _agregadosValidados,
            precio_base: precio_base,
            cantidad_disponible: cantidad_disponible,
            imagenes:imagenes
          }
          },
          {returnOriginal: false});
        if (!producto)
          return res.status(404).json("No se actualizó el producto");
        return res.status(200).json(producto);
      }else{
        return res.status(404).json("Producto no encontrado");
      }
    } catch (error) {
      return res.status(404).json(error);
    }
  };
  export const eliminarProducto = async (req, res) => {
    try {
      const producto = await productoModel.findOneAndDelete({ _id: req.params.id });
      if (!producto){
        return res.status(404).json("No se encuentra el producto");
      }
      else{
        return res.status(204).json("Producto eliminado");
      }
    } catch (error) {
      return res.status(404).json("Producto no encontrado");
    }
  };
