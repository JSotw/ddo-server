import agregadoModel from "../models/agregado.model.js";
import productoModel from "../models/producto.model.js";

export const obtenerUniques = async (req, res) => {
    try {
      const _agregados = await productoModel.aggregate([
        { $unwind: "$agregados" }, // Desanidar los agregados
      { $group: {
          _id: { nombre: "$agregados.nombre", precio: "$agregados.precio" },
          nombre: { $first: "$agregados.nombre" },
          precio: { $first: "$agregados.precio" },
        }
      },
      { $project: {
          _id: 0,
          nombre: 1,
          precio: 1,
        }
      }
    ]);
      console.log(_agregados);
      return res
        .status(200)
        .json({ message: "Datos recuperados", data: _agregados });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Agregados no disponibles o existentes", error: error.message });
    }
  };