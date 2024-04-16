import Mongoose, { Types } from "mongoose";

const inventarioSchema = new Mongoose.Schema(
  {
    nombre_insumo: {
      type: String,
      required: true,
    },
    total_pagado: {
      type: Number,
      required: true,
    },
    unidad_medida: {
      type: String,
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default Mongoose.model("Inventario", inventarioSchema);