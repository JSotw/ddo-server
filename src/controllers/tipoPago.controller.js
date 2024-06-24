import tipoPagoModel from "../models/tipo_pago.model.js";
import campoPagoRequeridoModel from "../models/campo_pago_requerido.model.js";


export const crearPagosIniciales = async (req, res) => {
  
    try {
      const pagosRegistrados = [];
      const pagoEfectivoEncontrado = await tipoPagoModel.findOne({ nombre: "Efectivo" });
      if(!pagoEfectivoEncontrado){
        const pagoEfectivo = new tipoPagoModel({
            nombre: "Efectivo",
            camposExtra: []
        });
        const pagoEfectivoGuardado = await pagoEfectivo.save();
        pagosRegistrados.push(pagoEfectivoGuardado);
      }else{
        pagosRegistrados.push(pagoEfectivoEncontrado);
      }
      const pagoElectronicoEncontrado = await tipoPagoModel.findOne({ nombre: "Electrónico" });
      if(!pagoElectronicoEncontrado){
        const campoNumTransferencia = new campoPagoRequeridoModel({
          nombre: "N° Transferencia",
          obligatorio: true
        });
        const pagoElec = new tipoPagoModel({
            nombre: "Electrónico",
            camposExtra: [campoNumTransferencia]
        });
        const pagoElecGuardado = await pagoElec.save();
        pagosRegistrados.push(pagoElec);
      }else{
        pagosRegistrados.push(pagoElectronicoEncontrado);
      }
      return res.status(200).json({
        "resultado": "Exito",
        "mensaje": "Datos registrados",
        "data": pagosRegistrados
      });
    } catch (error) {
      return res.status(401).json({
        "resultado": "Error",
        "mensaje": error.message
      });
    }
  };

  export const obtenerMediosPago = async (req, res) => {
  
    try {
      const pagos = await tipoPagoModel.find();
      if(pagos){
        return res.status(200).json(pagos);
      }else{
        return res.status(404).json({
          "mensaje": "No se pudieron recuperar resultados"
        });
      }
      
    } catch (error) {
      return res.status(402).json({
        "mensaje": error.message
      });
    }
  };