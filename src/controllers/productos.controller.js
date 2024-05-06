import productoModel from "../models/producto.model.js";
import agregadoModel from "../models/agregado.model.js";

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
      }else{
        return res.status(401).json({
          "resultado": "Error",
          "mensaje": "Producto ya registrado"
        });
      }
    } catch (error) {
      return res.status(401).json({
        "resultado": "Error",
        "mensaje": error.message
      });
    }
  };
  export const obtenerProducto = async (req, res) => {
    try {
      const producto = await productoModel.findOne({ _id: req.body.id });
      if (!producto)
        return res.status(404).json({ message: "No se encuentra el producto" });
      res.json(producto);
    } catch (error) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
  };
  export const obtenerProductoPorCodigo = async (req, res) => {
    try {
      const producto = await productoModel.findOne({ codigo: req.body.codigo });
      if (!producto)
        return res.status(404).json({ message: "No se encuentra el producto" });
      res.json(producto);
    } catch (error) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
  };
  export const actualizarProducto = async (req, res) => {
    try {
      const producto = await productoModel.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
        }
      );
      if (!producto)
        return res.status(404).json({ message: "No se encuentra el producto" });
      res.json(producto);
    } catch (error) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
  };
  export const eliminarProducto = async (req, res) => {
    try {
      console.log(req.params.id)
      const producto = await productoModel.findOneAndDelete({ _id: req.params.id });
      if (!producto)
        return res.status(404).json({ message: "No se encuentra el producto" });
      return res.sendStatus(204).json({message: "Producto eliminado"});
    } catch (error) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
  };
