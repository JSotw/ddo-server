import pedidoModel from "../models/pedido.model.js";
import detallePedidoModel from "../models/detalle_pedido.model.js";
import productoModel from "../models/producto.model.js";
import estadoModel from "../models/estado.model.js";
import pagoModel from "../models/pago.model.js";
import tipo_pagoModel from "../models/tipo_pago.model.js";


export const crearPedido = async (req, res) => {
    const {
        id_usuario,
        nombre_retiro,
        detalles,
        pagos,
        monto_total,
        estado
    } = req.body;
  
    try {
      const _detallesValidados = [];
      const _pagosValidados = [];
        if(detalles != undefined){
          if(detalles.length > 0){
            detalles.forEach(async det => {
                const producto = await productoModel.findOne({ _id: det.producto._id });
                if(producto){
                    if(producto.activo){
                        let nuevoDetalle = new detallePedidoModel({
                            producto: det.producto,
                            precio: det.precio,
                            cantidad: det.cantidad,
                            monto_total: det.monto_total
                        });
                        try{
                        let val = nuevoDetalle.validateSync();
                        if(val){
                            return res.status(401).json({
                            "resultado": "Error",
                            "mensaje": val
                            });
                        }
                        _detallesValidados.push(nuevoDetalle);
                        }catch(err){
                            return res.status(401).json({
                                "resultado": "Error",
                                "mensaje": err.message
                            });
                        }
                    }else{
                        return res.status(401).json({
                            "resultado": "Error",
                            "mensaje": "Producto "+producto.nombre+" inactivo"
                        });
                    }
                }else{
                    return res.status(401).json({
                        "resultado": "Error",
                        "mensaje": "Producto "+det.producto._id+" no encontrado"
                    });
                }
            });
          }
        }
        if(pagos != undefined){
            if(pagos.length > 0){
                pagos.forEach(p =>{
                    let tipo_pago = new 
                    let nuevoPago = new pagoModel({

                    });
                });
            }
        }
        if(estado != undefined){
            let _pedidoAbierto = true;
            if(estado.pedido_abierto == undefined){
                _pedidoAbierto = estado.pedido_abierto;
            }
            let estadoPedido = new estadoModel({
                nombre: estado.nombre,
                pedido_abierto: estado._pedidoAbierto
            });
            let valEstado = estadoPedido.validateSync();
            if(!valEstado){
                const nuevoPedido = new pedidoModel({
                    id_usuario,
                    nombre_retiro,
                    _detallesValidados,
                    pagos,
                    monto_total,
                    estadoPedido
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
                  "mensaje": "Estado de pedido requerido"
                });
            }
        }else{
            return res.status(401).json({
              "resultado": "Error",
              "mensaje": "Estado de pedido requerido"
            });
        }
    } catch (error) {
      return res.status(401).json({
        "resultado": "Error",
        "mensaje": error.message
      });
    }
  };
  function validarPago(_pago){
    let tipo_pago = new tipo
    let nuevoPago = new pagoModel({

    });
  }