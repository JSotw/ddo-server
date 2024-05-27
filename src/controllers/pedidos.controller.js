import pedidoModel from "../models/pedido.model.js";
import detallePedidoModel from "../models/detalle_pedido.model.js";
import productoModel from "../models/producto.model.js";
import estadoModel from "../models/estado.model.js";
import pagoModel from "../models/pago.model.js";
import tipoPagoModel from "../models/tipo_pago.model.js";
import campoExtraModel from "../models/campo_pago_requerido.model.js";
import ingredienteModel from "../models/ingrediente.model.js";
import agregadoModel from "../models/agregado.model.js";


export const crearPedido = async (req, res) => {
    const {
        id_usuario,
        nombre_retiro,
        detalles,
        pagos,
        estado
    } = req.body;
  
    try {
      let error = false;
      let errorMessage = "";
      const _detallesValidados = [];
      const _pagosValidados = [];
      let _montoTotal = 0;
        if(detalles != undefined){
          if(detalles.length > 0){
            for(const det of detalles) {
                let _montoDetalle = 0;
                const producto = await productoModel.findOne({ _id: det.producto._id });
                if(producto){
                    if(producto.activo){
                        const _ingredientesValidados = [];
                        let _montoAgregados = 0;
                        if(det.producto.agregados != undefined && det.producto.agregados != null){
                            for(const ag of det.producto.agregados){
                                if(ag.cantidad >= ag.minimo_selec && ag.cantidad <= ag.maximo_select){
                                    if(ag.precio != undefined){
                                        const _montoAgregado = ag.cantidad * ag.precio;
                                        const agregadoValidado = new agregadoModel({
                                            nombre: ag.nombre,
                                            precio: ag.precio,
                                            minimo_selec: ag.minimo_selec,
                                            maximo_select: ag.maximo_select
                                        });
                                        let val = agregadoValidado.validateSync();
                                        if(val){
                                            error = true;
                                            errorMessage = val.message;
                                            break;
                                        }
                                        _ingredientesValidados.push(
                                            new ingredienteModel({
                                                agregado: agregadoValidado,
                                                monto: _montoAgregado,
                                                cantidad: ag.cantidad
                                            })
                                        );
                                        _montoAgregados += _montoAgregado;
                                    }else{
                                        error = true;
                                        errorMessage = `Precio del agregado ${ag.nombre} no definido`;
                                        break;
                                    }
                                }else{
                                    error = true;
                                    errorMessage = `${ag.nombre} fuera de los límites`;
                                    console.log(errorMessage);
                                    break;
                                }
                            }
                            if(error){
                                break;
                            }
                        }
                        _montoDetalle = (det.precio + _montoAgregados) * det.cantidad;
                        _montoTotal += _montoDetalle;
                        let nuevoDetalle = new detallePedidoModel({
                            producto: producto,
                            ingredientes: _ingredientesValidados,
                            precio: det.precio,
                            cantidad: det.cantidad,
                            monto_total: _montoDetalle
                        });
                        try{
                        let val = nuevoDetalle.validateSync();
                        if(val){
                            error = true;
                            errorMessage = val.message;
                            break;
                        }
                        _detallesValidados.push(nuevoDetalle);
                        }catch(err){
                            error = true;
                            errorMessage = err.message;
                            break;
                        }
                    }else{
                        error = true;
                        errorMessage = "Producto "+producto.nombre+" inactivo";
                        break;
                    }
                }else{
                    error = true;
                    errorMessage = "Producto "+det.producto._id+" no encontrado";
                    break;
                }
            }
            if(error){
                return res.status(401).json({
                "resultado": "Error",
                "mensaje": errorMessage
                });
            }
          }
        }
        if(pagos != undefined){
            if(pagos.length > 0){
                for(const p of pagos){
                    if(p.tipo_pago != undefined){
                        try{
                            let _tipoPago = await tipoPagoModel.findOne({ nombre: p.tipo_pago.nombre });
                            if(_tipoPago){
                                let _camposExtraValidados = [];
                                if(p.tipo_pago.camposExtra === undefined || p.tipo_pago.camposExtra === null){
                                    p.tipo_pago.camposExtra = [];
                                }
                                if(_tipoPago.camposExtra != undefined){
                                    for(const ce of _tipoPago.camposExtra) {                                     
                                        let foundCampoExtra = p.tipo_pago.camposExtra.find((c) => c.nombre === ce.nombre);
                                        if(foundCampoExtra){
                                            if(ce.obligatorio && (foundCampoExtra.valor === undefined || foundCampoExtra.valor === null)){
                                                error = true;
                                                errorMessage = `El medio de pago ${p.tipo_pago.nombre} requiere que el campo ${ce.nombre} contenga un valor`;
                                                return;
                                            }else{
                                                let _valCampoExtra = new campoExtraModel({
                                                    nombre: ce.nombre,
                                                    obligatorio: ce.obligatorio,
                                                    valor: foundCampoExtra.valor
                                                });
                                                try{
                                                    let val = _valCampoExtra.validateSync();
                                                    if(val){
                                                        error = true;
                                                        errorMessage = val;
                                                        break;
                                                    }
                                                    _camposExtraValidados.push(_valCampoExtra);
                                                }catch(err){
                                                    error = true;
                                                    errorMessage = err.message;
                                                    break;
                                                }
                                            }
                                        }else{
                                            error = true;
                                            errorMessage = `No se pudo validar el valor ${ce.nombre} del medio de pago ${p.tipo_pago.nombre}`;
                                            break;
                                        }
                                    }
                                    if(error){
                                        break;
                                    }
                                }
                                let nuevoPago = new pagoModel({
                                    monto: p.monto,
                                    tipo_pago: new tipoPagoModel({
                                        nombre: _tipoPago.nombre,
                                        camposExtra: _camposExtraValidados
                                    })
                                });
                                try{
                                    let valPago = nuevoPago.validateSync();
                                    if(valPago){
                                        error = true;
                                        errorMessage = val;
                                        break;
                                    }
                                    _pagosValidados.push(nuevoPago);
                                }catch(err){
                                    error = true;
                                    errorMessage = err.message;
                                    break;
                                }
                            }else{
                                error = true;
                                errorMessage = `No se pudo validar el tipo de pago ${p.tipo_pago.nombre}(id: ${p.tipo_pago.id})`;
                                break;
                            }
                        }catch(error){
                            error = true;
                            errorMessage = `ocurrió un error durante el proceso de validación de medios de pago: ${error.message}`;
                            break;
                        }
                    }else{
                        error = true;
                        errorMessage = `Pago indefinido`;
                        break;
                    }
                }
                if(error){
                    return res.status(401).json({
                    "resultado": "Error",
                    "mensaje": errorMessage
                    });
                }
            }
        }
        if(estado != undefined){
            let _pedidoAbierto = true;
            if(estado.pedido_abierto == undefined){
                _pedidoAbierto = estado.pedido_abierto;
            }
            let estadoPedido = new estadoModel({
                nombre: estado.nombre,
                pedido_abierto: _pedidoAbierto
            });
            let valEstado = estadoPedido.validateSync();
            if(!valEstado){
                const nuevoPedido = new pedidoModel({
                    id_usuario,
                    nombre_retiro,
                    detalles: _detallesValidados,
                    pagos: _pagosValidados,
                    monto_total: _montoTotal,
                    estado: estadoPedido
                });
                const pedidoGuardado = await nuevoPedido.save();
                return res.status(200).json({
                "resultado": "Exito",
                "mensaje": "Pedido registrado",
                "datos": pedidoGuardado
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
export const actualizarPedido = async (req, res) => {
     const _id = req.params.id;
     console.log(_id);
      const {
          id_usuario,
          nombre_retiro,
          detalles,
          pagos,
          estado
      } = req.body;
    
       pedidoModel.findOne({_id: _id}).then( async (_pedidoOriginal) => {
        if(_pedidoOriginal.estado.pedido_abierto){
            try {
                let error = false;
                let errorMessage = "";
                const _detallesValidados = [];
                const _pagosValidados = [];
                let _montoTotal = 0;
                if(detalles != undefined){
                    if(detalles.length > 0){
                    for(const det of detalles) {
                        let _montoDetalle = 0;
                        const producto = await productoModel.findOne({ _id: det.producto._id });
                        if(producto){
                            if(producto.activo){
                                const _ingredientesValidados = [];
                                let _montoAgregados = 0;
                                if(det.producto.agregados != undefined && det.producto.agregados != null){
                                    for(const ag of det.producto.agregados){
                                        if(ag.cantidad >= ag.minimo_selec && ag.cantidad <= ag.maximo_select){
                                            if(ag.precio != undefined){
                                                const _montoAgregado = ag.cantidad * ag.precio;
                                                const agregadoValidado = new agregadoModel({
                                                    nombre: ag.nombre,
                                                    precio: ag.precio,
                                                    minimo_selec: ag.minimo_selec,
                                                    maximo_select: ag.maximo_select
                                                });
                                                let val = agregadoValidado.validateSync();
                                                if(val){
                                                    error = true;
                                                    errorMessage = val.message;
                                                    break;
                                                }
                                                _ingredientesValidados.push(
                                                    new ingredienteModel({
                                                        agregado: agregadoValidado,
                                                        monto: _montoAgregado,
                                                        cantidad: ag.cantidad
                                                    })
                                                );
                                                _montoAgregados += _montoAgregado;
                                            }else{
                                                error = true;
                                                errorMessage = `Precio del agregado ${ag.nombre} no definido`;
                                                break;
                                            }
                                        }else{
                                            error = true;
                                            errorMessage = `${ag.nombre} fuera de los límites`;
                                            console.log(errorMessage);
                                            break;
                                        }
                                    }
                                    if(error){
                                        break;
                                    }
                                }
                                _montoDetalle = (det.precio + _montoAgregados) * det.cantidad;
                                _montoTotal += _montoDetalle;
                                let nuevoDetalle = new detallePedidoModel({
                                    producto: producto,
                                    ingredientes: _ingredientesValidados,
                                    precio: det.precio,
                                    cantidad: det.cantidad,
                                    monto_total: _montoDetalle
                                });
                                try{
                                let val = nuevoDetalle.validateSync();
                                if(val){
                                    error = true;
                                    errorMessage = val.message;
                                    break;
                                }
                                _detallesValidados.push(nuevoDetalle);
                                }catch(err){
                                    error = true;
                                    errorMessage = err.message;
                                    break;
                                }
                            }else{
                                error = true;
                                errorMessage = "Producto "+producto.nombre+" inactivo";
                                break;
                            }
                        }else{
                            error = true;
                            errorMessage = "Producto "+det.producto._id+" no encontrado";
                            break;
                        }
                    }
                    if(error){
                        return res.status(401).json({
                        "resultado": "Error",
                        "mensaje": errorMessage
                        });
                    }
                    }
                }
                if(pagos != undefined){
                    if(pagos.length > 0){
                        for(const p of pagos){
                            if(p.tipo_pago != undefined){
                                try{
                                    let _tipoPago = await tipoPagoModel.findOne({ nombre: p.tipo_pago.nombre });
                                    if(_tipoPago){
                                        let _camposExtraValidados = [];
                                        if(p.tipo_pago.camposExtra === undefined || p.tipo_pago.camposExtra === null){
                                            p.tipo_pago.camposExtra = [];
                                        }
                                        if(_tipoPago.camposExtra != undefined){
                                            for(const ce of _tipoPago.camposExtra) {                                     
                                                let foundCampoExtra = p.tipo_pago.camposExtra.find((c) => c.nombre === ce.nombre);
                                                if(foundCampoExtra){
                                                    if(ce.obligatorio && (foundCampoExtra.valor === undefined || foundCampoExtra.valor === null)){
                                                        error = true;
                                                        errorMessage = `El medio de pago ${p.tipo_pago.nombre} requiere que el campo ${ce.nombre} contenga un valor`;
                                                        return;
                                                    }else{
                                                        let _valCampoExtra = new campoExtraModel({
                                                            nombre: ce.nombre,
                                                            obligatorio: ce.obligatorio,
                                                            valor: foundCampoExtra.valor
                                                        });
                                                        try{
                                                            let val = _valCampoExtra.validateSync();
                                                            if(val){
                                                                error = true;
                                                                errorMessage = val;
                                                                break;
                                                            }
                                                            _camposExtraValidados.push(_valCampoExtra);
                                                        }catch(err){
                                                            error = true;
                                                            errorMessage = err.message;
                                                            break;
                                                        }
                                                    }
                                                }else{
                                                    error = true;
                                                    errorMessage = `No se pudo validar el valor ${ce.nombre} del medio de pago ${p.tipo_pago.nombre}`;
                                                    break;
                                                }
                                            }
                                            if(error){
                                                break;
                                            }
                                        }
                                        let nuevoPago = new pagoModel({
                                            monto: p.monto,
                                            tipo_pago: new tipoPagoModel({
                                                nombre: _tipoPago.nombre,
                                                camposExtra: _camposExtraValidados
                                            })
                                        });
                                        try{
                                            let valPago = nuevoPago.validateSync();
                                            if(valPago){
                                                error = true;
                                                errorMessage = val;
                                                break;
                                            }
                                            _pagosValidados.push(nuevoPago);
                                        }catch(err){
                                            error = true;
                                            errorMessage = err.message;
                                            break;
                                        }
                                    }else{
                                        error = true;
                                        errorMessage = `No se pudo validar el tipo de pago ${p.tipo_pago.nombre}(id: ${p.tipo_pago.id})`;
                                        break;
                                    }
                                }catch(error){
                                    error = true;
                                    errorMessage = `ocurrió un error durante el proceso de validación de medios de pago: ${error.message}`;
                                    break;
                                }
                            }else{
                                error = true;
                                errorMessage = `Pago indefinido`;
                                break;
                            }
                        }
                        if(error){
                            return res.status(401).json({
                            "resultado": "Error",
                            "mensaje": errorMessage
                            });
                        }
                    }
                }
                if(estado != undefined){
                    let _pedidoAbierto = true;
                    if(estado.pedido_abierto == undefined){
                        _pedidoAbierto = estado.pedido_abierto;
                    }
                    let estadoPedido = new estadoModel({
                        nombre: estado.nombre,
                        pedido_abierto: _pedidoAbierto
                    });
                    let valEstado = estadoPedido.validateSync();
                    if(!valEstado){
                        const pedidoGuardado = await pedidoModel.findByIdAndUpdate(_id, {
                            id_usuario: id_usuario,
                            nombre_retiro: nombre_retiro,
                            detalles: _detallesValidados,
                            pagos: _pagosValidados,
                            monto_total: _montoTotal,
                            estado: estadoPedido
                        });
                        if(pedidoGuardado){
                            return res.status(200).json({
                            "resultado": "Exito",
                            "mensaje": "Pedido actualizado",
                            "datos": pedidoGuardado
                            });
                        }else{
                            return res.status(200).json({
                            "resultado": "Error",
                            "mensaje": "Pedido no actualizado"
                            });
                        }
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
        }else{
            return res.status(401).json({
            "resultado": "Error",
            "mensaje": `El pedido no se puede modificar en estado ${_pedidoOriginal.estado.nombre}`
            });
        }
       }).catch((error) =>{
        return res.status(404).json({
        "resultado": "Error",
        "mensaje": `Pedido no encontrado${error.message}`
        });
       });
};
export const actualizarDetallePedido = async (req, res) => {
        const _id = req.params.id;
        const {
            detalles
        } = req.body;
        pedidoModel.findOne({_id: _id}).then( async (_pedidoOriginal) => {
            if(_pedidoOriginal.estado.pedido_abierto){
                let error = false;
                let errorMessage = "";
                for(const det of detalles){
                    let _montoDetalle = 0;
                    const producto = await productoModel.findOne({ _id: det.producto._id });
                    if(producto){
                        if(producto.activo){
                            const _ingredientesValidados = [];
                            let _montoAgregados = 0;
                            if(det.producto.agregados != undefined && det.producto.agregados != null){
                                for(const ag of det.producto.agregados){
                                    if(ag.cantidad >= ag.minimo_selec && ag.cantidad <= ag.maximo_select){
                                        if(ag.precio != undefined){
                                            const _montoAgregado = ag.cantidad * ag.precio;
                                            const agregadoValidado = new agregadoModel({
                                                nombre: ag.nombre,
                                                precio: ag.precio,
                                                minimo_selec: ag.minimo_selec,
                                                maximo_select: ag.maximo_select
                                            });
                                            let val = agregadoValidado.validateSync();
                                            if(val){
                                                error = true;
                                                errorMessage = val.message;
                                                break;
                                            }
                                            _ingredientesValidados.push(
                                                new ingredienteModel({
                                                    agregado: agregadoValidado,
                                                    monto: _montoAgregado,
                                                    cantidad: ag.cantidad
                                                })
                                            );
                                            _montoAgregados += _montoAgregado;
                                        }else{
                                            error = true;
                                            errorMessage = `Precio del agregado ${ag.nombre} no definido`;
                                            break;
                                        }
                                    }else{
                                        error = true;
                                        errorMessage = `${ag.nombre} fuera de los límites`;
                                        console.log(errorMessage);
                                        break;
                                    }
                                }
                                if(error){
                                    break;
                                }
                            }
                            _montoDetalle = (det.precio + _montoAgregados) * det.cantidad;
                            if(det._id != undefined){
                                let found = false;
                                for(let exDet of _pedidoOriginal.detalles){
                                    if(exDet._id == det._id){
                                        exDet.producto = producto;
                                        exDet.ingredientes = _ingredientesValidados;
                                        exDet.precio = det.precio;
                                        exDet.cantidad = det.cantidad;
                                        exDet.monto_total = _montoDetalle;
                                        found = true;
                                        break;
                                    }
                                }
                                if(!found){
                                    error = true;
                                    errorMessage = `Detalle ${det._id} no encontrado`;
                                    break;
                                }
                            }else{
                                let nuevoDetalle = new detallePedidoModel({
                                    producto: producto,
                                    ingredientes: _ingredientesValidados,
                                    precio: det.precio,
                                    cantidad: det.cantidad,
                                    monto_total: _montoDetalle
                                });
                                try{
                                    let val = nuevoDetalle.validateSync();
                                    if(val){
                                        error = true;
                                        errorMessage = val.message;
                                        break;
                                    }
                                    _pedidoOriginal.detalles.push(nuevoDetalle);
                                }catch(err){
                                    error = true;
                                    errorMessage = err.message;
                                    break;
                                }
                            }
                        }else{
                            error = true;
                            errorMessage = "Producto "+producto.nombre+" inactivo";
                            break;
                        }
                    }else{
                        error = true;
                        errorMessage = "Producto "+det.producto._id+" no encontrado";
                        break;
                    }
                }
                if(error){
                    return res.status(401).json({
                    "resultado": "Error",
                    "mensaje": errorMessage
                    });
                }else{
                    const save = await _pedidoOriginal.save();
                    console.log(save);
                    return res.status(200).json({
                    "resultado": "Exito",
                    "mensaje": "Pedido actualizado",
                    "data": _pedidoOriginal
                    });
                }
            }
        }).catch((error) =>{
            return res.status(404).json({
            "resultado": "Error",
            "mensaje": `Pedido no encontrado ${error.message}`
            });
        });
};
export const reporteVentasDiario = async(req, res) => {
    try{
        const _desde = new Date(req.params.desde);
        const _hasta = new Date(req.params.hasta);

        const _pedidos = await pedidoModel.find({createdAt: { $gte: _desde, $lte: _hasta} });
        console.log(_pedidos);
        let total = 0;
        let gastos = 0;
        let clientes = [];
        let ordenes = 0;
        for(const p of _pedidos){
            total += p.monto_total;
            if(!clientes.includes(p.nombre_retiro)){
                clientes.push(p.nombre_retiro);
            }
            ordenes++;
        }
        return res.status(202).json({
            "resultado": "Exito",
            "data": {
                "total": total,
                "gastos": gastos,
                "clientes": clientes.length,
                "ordenes": ordenes
            }
        });
    }catch(err){
        return res.status(400).json({
            "resultado": "Error",
            "mensaje": `${err.message}`
        });
    }
}