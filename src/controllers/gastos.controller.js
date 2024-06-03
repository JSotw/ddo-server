import gastoModel from "../models/gasto.model.js";

export const registrarGasto = async (req, res) => {
    try {
        const {
            nombre,
            costo,
            fecha
            } = req.body;
        const gasto = new gastoModel({
            nombre: nombre,
            costo: costo,
            fecha: fecha
        });
        const gastoGuardado = await gasto.save();
        return res.status(200).json({
            "resultado": "Exito",
            "mensaje": "Gasto registrado",
            "datos": gastoGuardado
            });
    } catch (error) {
        return res
        .status(500)
        .json({ message: "Error", error: error.message });
    }
};
export const actualizarGasto = async (req, res) => {
    try{
        const _gasto = await gastoModel.findOneAndUpdate({ _id: req.params.id },req.body,{new: true}
            );
        if (!_gasto)
            return res.status(404).json({ message: "No se encuentra el registro" });
        return res.status(202).json({ message: "Datos Actulizados", datos: _gasto });
    }catch(error){
        return res.status(500).json({ message: "Error", error: error.message });
    }
};

export const eliminarGasto = async (req, res) => {
    try {
        const {
            id
            } = req.params;
        const elim = await gastoModel.findByIdAndDelete(id);
        if (!elim)
            return res.status(404).json({ message: "No se encuentra el registro" });
        return res.status(202).json({message: "Registro eliminado"});
    } catch (error) {
        return res.status(500).json({ message: "Error", error: error.message });
    }
};
export const recuperar = async (req, res) => {
    try {
        const {
            id,
            desde,
            hasta
            } = req.query;
        let registros;
        if(id != undefined){
            console.log(id);
            registros = await gastoModel.find({_id :id});
        }
        else if(desde != undefined && hasta != undefined){
            console.log(desde);
            console.log(hasta);
            registros = await gastoModel.find({fecha: {$gte: new Date(desde), $lte:  new Date(hasta)}});
        }
        else
            registros = await gastoModel.find();
        return res.status(202).json({message: "Datos recuperados", datos: registros});
    } catch (error) {
        return res.status(500).json({ message: "Error", error: error.message });
    }
};