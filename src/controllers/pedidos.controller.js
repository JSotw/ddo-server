import pedidoModel from "../models/pedido.model.js";
import detallePedidoModel from "../models/detalle_pedido.model.js";
import productoModel from "../models/producto.model.js";
import estadoModel from "../models/estado.model.js";
import pagoModel from "../models/pago.model.js";
import tipoPagoModel from "../models/tipo_pago.model.js";
import campoExtraModel from "../models/campo_pago_requerido.model.js";
import ingredienteModel from "../models/ingrediente.model.js";
import agregadoModel from "../models/agregado.model.js";
import gastoModel from "../models/gasto.model.js";
import { Int32 } from "mongodb";

export const obtenerPedido = async (req, res) => {
  try {
    const pedido = await pedidoModel.findOne({ _id: req.params.id });
    if (!pedido) return res.status(404).json("No se encuentra el pedido");
    res.status(200).json(pedido);
  } catch (error) {
    return res.status(404).json("Pedido no encontrado");
  }
};
export const obtenerAllPedidos = async (req, res) => {
  try {
    const pedido = await pedidoModel.find();
    if (!pedido) return res.status(404).json("No se encuentran los pedidos");
    res.status(200).json(pedido);
  } catch (error) {
    return res.status(404).json("Pedidos no encontrados");
  }
};
export const obtenerPedidos = async (req, res) => {
  try {
    const _desde = new Date(req.params.desde);
    const _hasta = new Date(req.params.hasta);
    let _params = {
      createdAt: { $gte: _desde, $lte: _hasta },
    };
    if (req.query.estado !== undefined) {
      try {
        if (req.query.estado === "1") {
          _params["estado.pedido_abierto"] = true;
        } else {
          _params["estado.pedido_abierto"] = false;
        }
      } catch (er) {
        console.log(er);
      }
    }
    console.log(_params);
    const pedidos = await pedidoModel.find(_params);
    if (!pedidos) return res.status(404).json("Datos recuperados");
    res.status(200).json(pedidos);
  } catch (error) {
    return res.status(404).json("Pedidos no recuperados");
  }
};
export const crearPedido = async (req, res) => {
  const { id_usuario, nombre_retiro, detalles, pagos, estado } = req.body;

  try {
    let error = false;
    let errorMessage = "";
    const _detallesValidados = [];
    const _pagosValidados = [];
    let _montoTotal = 0;
    if (detalles != undefined) {
      if (detalles.length > 0) {
        for (const det of detalles) {
          let _cantidad = 0;
          if (det.cantidad != undefined && det.cantidad != null) {
            _cantidad = det.cantidad;
          }
          if (_cantidad > 0) {
            let _montoDetalle = 0;
            const producto = await productoModel.findOne({
              _id: det.producto_id,
            });
            if (producto) {
              if (producto.activo) {
                const _ingredientesValidados = [];
                let _montoAgregados = 0;
                if (det.agregados != undefined && det.agregados != null) {
                  for (const ag of det.agregados) {
                    const agregado = producto.agregados.find(
                      (a) => a.nombre === ag.nombre
                    );
                    if (agregado) {
                      if (
                        ag.cantidad >= agregado.minimo_selec &&
                        ag.cantidad <= agregado.maximo_select
                      ) {
                        if (agregado.precio != undefined) {
                          const _montoAgregado = ag.cantidad * agregado.precio;
                          _ingredientesValidados.push(
                            new ingredienteModel({
                              agregado: agregado,
                              monto: _montoAgregado,
                              cantidad: ag.cantidad,
                            })
                          );
                          _montoAgregados += _montoAgregado;
                        } else {
                          error = true;
                          errorMessage = `Precio del agregado ${ag.nombre} no definido`;
                          break;
                        }
                      } else {
                        error = true;
                        errorMessage = `${agregado.nombre} fuera de los límites (${agregado.minimo_selec}-${agregado.maximo_select})`;
                        break;
                      }
                    } else {
                      error = true;
                      errorMessage = `${ag.nombre} no está disponible para este producto`;
                      break;
                    }
                  }
                  if (error) {
                    break;
                  }
                }
                _montoDetalle =
                  (producto.precio_base + _montoAgregados) * det.cantidad;
                _montoTotal += _montoDetalle;
                let nuevoDetalle = new detallePedidoModel({
                  producto: producto,
                  ingredientes: _ingredientesValidados,
                  precio: producto.precio_base,
                  cantidad: det.cantidad,
                  monto_total: _montoDetalle,
                });
                try {
                  let val = nuevoDetalle.validateSync();
                  if (val) {
                    error = true;
                    errorMessage = val.message;
                    break;
                  }
                  _detallesValidados.push(nuevoDetalle);
                } catch (err) {
                  error = true;
                  errorMessage = err.message;
                  break;
                }
              } else {
                error = true;
                errorMessage = "Producto " + producto.nombre + " inactivo";
                break;
              }
            } else {
              error = true;
              errorMessage = "Producto " + det.producto_id + " no encontrado";
              break;
            }
          } else {
            error = true;
            errorMessage = "Producto " + det.producto_id + " sin cantidad";
            break;
          }
        }
        if (error) {
          return res.status(401).json({
            resultado: "Error",
            mensaje: errorMessage,
          });
        }
      }
    }
    if (pagos != undefined) {
      if (pagos.length > 0) {
        for (const p of pagos) {
          if (p.tipo_pago != undefined) {
            try {
              let _tipoPago = await tipoPagoModel.findOne({
                nombre: p.tipo_pago.nombre,
              });
              if (_tipoPago) {
                let _camposExtraValidados = [];
                if (
                  p.tipo_pago.camposExtra === undefined ||
                  p.tipo_pago.camposExtra === null
                ) {
                  p.tipo_pago.camposExtra = [];
                }
                if (_tipoPago.camposExtra != undefined) {
                  for (const ce of _tipoPago.camposExtra) {
                    let foundCampoExtra = p.tipo_pago.camposExtra.find(
                      (c) => c.nombre === ce.nombre
                    );
                    if (foundCampoExtra) {
                      if (
                        ce.obligatorio &&
                        (foundCampoExtra.valor === undefined ||
                          foundCampoExtra.valor === null)
                      ) {
                        error = true;
                        errorMessage = `El medio de pago ${p.tipo_pago.nombre} requiere que el campo ${ce.nombre} contenga un valor`;
                        return;
                      } else {
                        let _valCampoExtra = new campoExtraModel({
                          nombre: ce.nombre,
                          obligatorio: ce.obligatorio,
                          valor: foundCampoExtra.valor,
                        });
                        try {
                          let val = _valCampoExtra.validateSync();
                          if (val) {
                            error = true;
                            errorMessage = val;
                            break;
                          }
                          _camposExtraValidados.push(_valCampoExtra);
                        } catch (err) {
                          error = true;
                          errorMessage = err.message;
                          break;
                        }
                      }
                    } else {
                      error = true;
                      errorMessage = `No se pudo validar el valor ${ce.nombre} del medio de pago ${p.tipo_pago.nombre}`;
                      break;
                    }
                  }
                  if (error) {
                    break;
                  }
                }
                let nuevoPago = new pagoModel({
                  monto: p.monto,
                  tipo_pago: new tipoPagoModel({
                    nombre: _tipoPago.nombre,
                    camposExtra: _camposExtraValidados,
                  }),
                });
                try {
                  let valPago = nuevoPago.validateSync();
                  if (valPago) {
                    error = true;
                    errorMessage = val;
                    break;
                  }
                  _pagosValidados.push(nuevoPago);
                } catch (err) {
                  error = true;
                  errorMessage = err.message;
                  break;
                }
              } else {
                error = true;
                errorMessage = `No se pudo validar el tipo de pago ${p.tipo_pago.nombre}(id: ${p.tipo_pago.id})`;
                break;
              }
            } catch (error) {
              error = true;
              errorMessage = `ocurrió un error durante el proceso de validación de medios de pago: ${error.message}`;
              break;
            }
          } else {
            error = true;
            errorMessage = `Pago indefinido`;
            break;
          }
        }
        if (error) {
          return res.status(401).json({
            resultado: "Error",
            mensaje: errorMessage,
          });
        }
      }
    }
    let _estadoNombre = "En Proceso";
    if (estado != undefined) {
      _estadoNombre = estado;
    }
    let estadoPedido = await estadoModel.findOne({ nombre: _estadoNombre });
    if (!estadoPedido) {
      estadoPedido = await estadoModel.findOne({ nombre: "En Proceso" });
    }
    if (estadoPedido) {
      const nuevoPedido = new pedidoModel({
        id_usuario,
        nombre_retiro: nombre_retiro,
        detalles: _detallesValidados,
        pagos: _pagosValidados,
        monto_total: _montoTotal,
        estado: estadoPedido,
      });
      const pedidoGuardado = await nuevoPedido.save();
      return res.status(200).json(pedidoGuardado);
    } else {
      return res.status(401).json({
        resultado: "Error",
        mensaje: "Estado de pedido no encontrado",
      });
    }
  } catch (error) {
    return res.status(401).json(error.message);
  }
};
export const actualizarPedido = async (req, res) => {
  const _id = req.params.id;
  const { id_usuario, nombre_retiro, detalles, pagos, estado } = req.body;

  try {
    const _pedidoOriginal = await pedidoModel.findOne({ _id: _id });
    if (_pedidoOriginal.estado.pedido_abierto) {
      try {
        let error = false;
        let errorMessage = "";
        const _detallesValidados = [];
        const _pagosValidados = [];
        let _montoTotal = 0;
        if (detalles != undefined) {
          if (detalles.length > 0) {
            for (const det of detalles) {
              let _cantidad = 0;
              if (det.cantidad != undefined && det.cantidad != null) {
                _cantidad = det.cantidad;
              }
              if (_cantidad > 0) {
                let _montoDetalle = 0;
                const producto = await productoModel.findOne({
                  _id: det.producto._id,
                });
                if (producto) {
                  if (producto.activo) {
                    const _ingredientesValidados = [];
                    let _montoAgregados = 0;
                    if (det.agregados != undefined && det.agregados != null) {
                      for (const ag of det.agregados) {
                        const agregado = producto.agregados.find(
                          (a) => a.nombre === ag.nombre
                        );
                        if (agregado) {
                          if (
                            ag.cantidad >= agregado.minimo_selec &&
                            ag.cantidad <= agregado.maximo_select
                          ) {
                            if (agregado.precio != undefined) {
                              const _montoAgregado =
                                ag.cantidad * agregado.precio;
                              _ingredientesValidados.push(
                                new ingredienteModel({
                                  agregado: agregado,
                                  monto: _montoAgregado,
                                  cantidad: ag.cantidad,
                                })
                              );
                              _montoAgregados += _montoAgregado;
                            } else {
                              error = true;
                              errorMessage = `Precio del agregado ${ag.nombre} no definido`;
                              break;
                            }
                          } else {
                            error = true;
                            errorMessage = `${agregado.nombre} fuera de los límites (${agregado.minimo_selec}-${agregado.maximo_select})`;
                            break;
                          }
                        } else {
                          error = true;
                          errorMessage = `${ag.nombre} no está disponible para este producto`;
                          break;
                        }
                      }
                      if (error) {
                        break;
                      }
                    }
                    _montoDetalle =
                      (producto.precio_base + _montoAgregados) * det.cantidad;
                    _montoTotal += _montoDetalle;
                    let nuevoDetalle = new detallePedidoModel({
                      producto: producto,
                      ingredientes: _ingredientesValidados,
                      precio: producto.precio_base,
                      cantidad: det.cantidad,
                      monto_total: _montoDetalle,
                    });
                    try {
                      let val = nuevoDetalle.validateSync();
                      if (val) {
                        error = true;
                        errorMessage = val.message;
                        break;
                      }
                      _detallesValidados.push(nuevoDetalle);
                    } catch (err) {
                      error = true;
                      errorMessage = err.message;
                      break;
                    }
                  } else {
                    error = true;
                    errorMessage = "Producto " + producto.nombre + " inactivo";
                    break;
                  }
                } else {
                  error = true;
                  errorMessage =
                    "Producto " + det.producto_id + " no encontrado";
                  break;
                }
              } else {
                error = true;
                errorMessage = "Producto " + det.producto_id + " sin cantidad";
                break;
              }
            }
            if (error) {
              return res.status(401).json({
                resultado: "Error",
                mensaje: errorMessage,
              });
            }
          }
        }
        if (pagos != undefined) {
          if (pagos.length > 0) {
            for (const p of pagos) {
              if (p.tipo_pago != undefined) {
                try {
                  let _tipoPago = await tipoPagoModel.findOne({
                    nombre: p.tipo_pago.nombre,
                  });
                  if (_tipoPago) {
                    let _camposExtraValidados = [];
                    if (
                      p.tipo_pago.camposExtra === undefined ||
                      p.tipo_pago.camposExtra === null
                    ) {
                      p.tipo_pago.camposExtra = [];
                    }
                    if (_tipoPago.camposExtra != undefined) {
                      for (const ce of _tipoPago.camposExtra) {
                        let foundCampoExtra = p.tipo_pago.camposExtra.find(
                          (c) => c.nombre === ce.nombre
                        );
                        if (foundCampoExtra) {
                          if (
                            ce.obligatorio &&
                            (foundCampoExtra.valor === undefined ||
                              foundCampoExtra.valor === null)
                          ) {
                            error = true;
                            errorMessage = `El medio de pago ${p.tipo_pago.nombre} requiere que el campo ${ce.nombre} contenga un valor`;
                            return;
                          } else {
                            let _valCampoExtra = new campoExtraModel({
                              nombre: ce.nombre,
                              obligatorio: ce.obligatorio,
                              valor: foundCampoExtra.valor,
                            });
                            try {
                              let val = _valCampoExtra.validateSync();
                              if (val) {
                                error = true;
                                errorMessage = val;
                                break;
                              }
                              _camposExtraValidados.push(_valCampoExtra);
                            } catch (err) {
                              error = true;
                              errorMessage = err.message;
                              break;
                            }
                          }
                        } else {
                          error = true;
                          errorMessage = `No se pudo validar el valor ${ce.nombre} del medio de pago ${p.tipo_pago.nombre}`;
                          break;
                        }
                      }
                      if (error) {
                        break;
                      }
                    }
                    let nuevoPago = new pagoModel({
                      monto: p.monto,
                      tipo_pago: new tipoPagoModel({
                        nombre: _tipoPago.nombre,
                        camposExtra: _camposExtraValidados,
                      }),
                    });
                    try {
                      let valPago = nuevoPago.validateSync();
                      if (valPago) {
                        error = true;
                        errorMessage = val;
                        break;
                      }
                      _pagosValidados.push(nuevoPago);
                    } catch (err) {
                      error = true;
                      errorMessage = err.message;
                      break;
                    }
                  } else {
                    error = true;
                    errorMessage = `No se pudo validar el tipo de pago ${p.tipo_pago.nombre}(id: ${p.tipo_pago.id})`;
                    break;
                  }
                } catch (error) {
                  error = true;
                  errorMessage = `ocurrió un error durante el proceso de validación de medios de pago: ${error.message}`;
                  break;
                }
              } else {
                error = true;
                errorMessage = `Pago indefinido`;
                break;
              }
            }
            if (error) {
              return res.status(401).json({
                resultado: "Error",
                mensaje: errorMessage,
              });
            }
          }
        }
        let _estadoNombre = "En Proceso";
        if (estado != undefined) {
          _estadoNombre = estado;
        }
        let estadoPedido = await estadoModel.findOne({ nombre: _estadoNombre });
        if (!estadoPedido) {
          estadoPedido = await estadoModel.findOne({ nombre: "En Proceso" });
        }
        if (estadoPedido) {
          const updatePedido = await pedidoModel.findByIdAndUpdate(_id, {
            id_usuario: id_usuario,
            nombre_retiro: nombre_retiro,
            detalles: _detallesValidados,
            pagos: _pagosValidados,
            monto_total: _montoTotal,
            estado: estadoPedido,
          });
          const updated = await pedidoModel.findById(_id);
          if (updatePedido) {
            return res.status(200).json({
              resultado: "Exito",
              mensaje: "Pedido actualizado",
              datos: updated,
            });
          } else {
            return res.status(200).json({
              resultado: "Error",
              mensaje: "Pedido no actualizado",
            });
          }
        } else {
          return res.status(401).json({
            resultado: "Error",
            mensaje: "Estado de pedido requerido",
          });
        }
      } catch (error) {
        return res.status(401).json({
          resultado: "Error",
          mensaje: error.message,
        });
      }
    } else {
      return res.status(401).json({
        resultado: "Error",
        mensaje: `El pedido no se puede modificar en estado ${_pedidoOriginal.estado.nombre}`,
      });
    }
  } catch (err) {
    return res.status(404).json({
      resultado: "Error",
      mensaje: `Pedido no encontrado${err.message}`,
    });
  }
};
export const actualizarDetallePedido = async (req, res) => {
  const _id = req.params.id;
  const { detalles } = req.body;
  pedidoModel
    .findOne({ _id: _id })
    .then(async (_pedidoOriginal) => {
      if (_pedidoOriginal.estado.pedido_abierto) {
        let error = false;
        let errorMessage = "";
        for (const det of detalles) {
          let _montoDetalle = 0;
          const producto = await productoModel.findOne({
            _id: det.producto._id,
          });
          if (producto) {
            if (producto.activo) {
              const _ingredientesValidados = [];
              let _montoAgregados = 0;
              if (
                det.producto.agregados != undefined &&
                det.producto.agregados != null
              ) {
                for (const ag of det.producto.agregados) {
                  if (
                    ag.cantidad >= ag.minimo_selec &&
                    ag.cantidad <= ag.maximo_select
                  ) {
                    if (ag.precio != undefined) {
                      const _montoAgregado = ag.cantidad * ag.precio;
                      const agregadoValidado = new agregadoModel({
                        nombre: ag.nombre,
                        precio: ag.precio,
                        minimo_selec: ag.minimo_selec,
                        maximo_select: ag.maximo_select,
                      });
                      let val = agregadoValidado.validateSync();
                      if (val) {
                        error = true;
                        errorMessage = val.message;
                        break;
                      }
                      _ingredientesValidados.push(
                        new ingredienteModel({
                          agregado: agregadoValidado,
                          monto: _montoAgregado,
                          cantidad: ag.cantidad,
                        })
                      );
                      _montoAgregados += _montoAgregado;
                    } else {
                      error = true;
                      errorMessage = `Precio del agregado ${ag.nombre} no definido`;
                      break;
                    }
                  } else {
                    error = true;
                    errorMessage = `${ag.nombre} fuera de los límites`;
                    break;
                  }
                }
                if (error) {
                  break;
                }
              }
              _montoDetalle = (det.precio + _montoAgregados) * det.cantidad;
              if (det._id != undefined) {
                let found = false;
                for (let exDet of _pedidoOriginal.detalles) {
                  if (exDet._id == det._id) {
                    exDet.producto = producto;
                    exDet.ingredientes = _ingredientesValidados;
                    exDet.precio = det.precio;
                    exDet.cantidad = det.cantidad;
                    exDet.monto_total = _montoDetalle;
                    found = true;
                    break;
                  }
                }
                if (!found) {
                  error = true;
                  errorMessage = `Detalle ${det._id} no encontrado`;
                  break;
                }
              } else {
                let nuevoDetalle = new detallePedidoModel({
                  producto: producto,
                  ingredientes: _ingredientesValidados,
                  precio: det.precio,
                  cantidad: det.cantidad,
                  monto_total: _montoDetalle,
                });
                try {
                  let val = nuevoDetalle.validateSync();
                  if (val) {
                    error = true;
                    errorMessage = val.message;
                    break;
                  }
                  _pedidoOriginal.detalles.push(nuevoDetalle);
                } catch (err) {
                  error = true;
                  errorMessage = err.message;
                  break;
                }
              }
            } else {
              error = true;
              errorMessage = "Producto " + producto.nombre + " inactivo";
              break;
            }
          } else {
            error = true;
            errorMessage = "Producto " + det.producto._id + " no encontrado";
            break;
          }
        }
        if (error) {
          return res.status(401).json({
            resultado: "Error",
            mensaje: errorMessage,
          });
        } else {
          const save = await _pedidoOriginal.save();
          return res.status(200).json({
            resultado: "Exito",
            mensaje: "Pedido actualizado",
            data: _pedidoOriginal,
          });
        }
      }
    })
    .catch((error) => {
      return res.status(404).json({
        resultado: "Error",
        mensaje: `Pedido no encontrado ${error.message}`,
      });
    });
};
export const reporteVentasDiario = async (req, res) => {
  try {
    const _desde = new Date(req.params.desde);
    const _hasta = new Date(req.params.hasta);

    const _difDesdeHasta = _hasta - _desde;
    const _desdeComparativa = _desde - _difDesdeHasta;

    const _pedidos = await pedidoModel.find({
      createdAt: { $gte: _desde, $lte: _hasta },
    });
    const _pedidosAnteriores = await pedidoModel.find({
      createdAt: { $gte: _desdeComparativa, $lte: _desde },
    });
    const _gastos = await gastoModel.find({
      fecha: { $gte: _desde, $lte: _hasta },
    });
    const _gastosAnteriores = await gastoModel.find({
      fecha: { $gte: _desdeComparativa, $lte: _desde },
    });
    let total = 0;
    let totalAnterior = 0;
    let gastos = 0;
    let gastosAnteriores = 0;
    let clientes = [];
    let clientesAnteriores = [];
    let ordenes = 0;
    let ordenesAnteriores = 0;

    for (const p of _pedidos) {
      total += p.monto_total;
      if (!clientes.includes(p.nombre_retiro)) {
        clientes.push(p.nombre_retiro);
      }
      ordenes++;
    }

    for (const p of _pedidosAnteriores) {
      totalAnterior += p.monto_total;
      if (!clientesAnteriores.includes(p.nombre_retiro)) {
        clientesAnteriores.push(p.nombre_retiro);
      }
      ordenesAnteriores++;
    }

    for (const g of _gastos) {
      gastos += g.costo;
    }
    for (const g of _gastosAnteriores) {
      gastosAnteriores += g.costo;
    }
    return res.status(202).json({
      total: total,
      totalAnterior: totalAnterior,
      gastos: gastos,
      gastosAnteriores: gastosAnteriores,
      clientes: clientes.length,
      clientesAnteriores: clientesAnteriores.length,
      ordenes: ordenes,
      ordenesAnteriores: ordenesAnteriores,
    });
  } catch (err) {
    return res.status(400).json({
      mensaje: `${err.message}`,
    });
  }
};
export const reporteVentasXDia = async (req, res) => {
  try {
    const _desde = new Date(req.params.desde);
    const _hasta = new Date(req.params.hasta);
    const _agrupacion = req.query.groupBy;
    const _fillEmpty = new Boolean(req.query.fillEmpty);

    const _pedidos = await pedidoModel.find({
      createdAt: { $gte: _desde, $lte: _hasta },
    });
    let options = { year: "numeric", month: "long", day: "numeric" }; //weekday: "long",
    let _plusDays = 1;
    if (_agrupacion == "año") {
      options = { year: "numeric" };
      _plusDays = 365;
    } else if (_agrupacion == "mes") {
      options = { year: "numeric", month: "long" };
      _plusDays = 28;
    } else {
      options = { year: "numeric", month: "numeric", day: "numeric" };
      _plusDays = 1;
    }

    var format = new Intl.DateTimeFormat("es-ES", options).format;
    let registros = new Array();

    if (_fillEmpty == true) {
      let _fechaActual = new Date(_desde);
      while (_fechaActual <= _hasta) {
        const _fecha = format(_fechaActual);
        let existe = registros.findIndex((r) => r.fecha === _fecha);
        if (existe == -1) {
          registros.push({
            fecha: _fecha,
            monto: 0,
          });
        }
        _fechaActual.setDate(_fechaActual.getDate() + _plusDays);
      }
    }
    for (const p of _pedidos) {
      const _fecha = format(p.createdAt);
      let existe = registros.findIndex((r) => r.fecha === _fecha);
      if (!existe) {
        registros.push({
          fecha: _fecha,
          monto: p.monto_total,
        });
      } else {
        registros[existe].monto += p.monto_total;
      }
    }
    return res.status(202).json({
      registros: registros,
    });
  } catch (err) {
    return res.status(400).json({
      mensaje: `${err.message}`,
    });
  }
};
