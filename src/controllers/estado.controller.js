import estadoModel from "../models/estado.model.js";


export const crearEstadosIniciales = async (req, res) => {
  
    try {
      const estadosRegistrados = [];
      const estadosRegistrar = [
        {
            "nombre": "En Proceso",
            "pedidoAbierto": true
        },
        {
            "nombre": "Terminado",
            "pedidoAbierto": false
        }
      ];
      estadosRegistrar.forEach(async estado => {
        let estadoEncontrado = await estadoModel.findOne({nombre: estado.nombre});
        if(!estadoEncontrado){
            let registro = new estadoModel({
                nombre: estado.nombre,
                pedido_abierto: estado.pedidoAbierto
            });
            let estadoRegistrado = await registro.save();
            estadosRegistrados.push(estadoRegistrado);
        }else{
            estadosRegistrados.push(estadoEncontrado);
        }
      });
      return res.status(401).json({
        "resultado": "Exito",
        "mensaje": "Datos registrados",
        "data": estadosRegistrados
      });
    } catch (error) {
      return res.status(401).json({
        "resultado": "Error",
        "mensaje": error.message
      });
    }
  };