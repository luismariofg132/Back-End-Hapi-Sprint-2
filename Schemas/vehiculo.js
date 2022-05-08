const Joi = require('joi');

const bodySchemaVehiculo = Joi.object({
    placa: Joi.string().max(6),
    modelo: Joi.number().max(4).required(),
    fv_seguro: Joi.string().min(10).required(),
    fv_tecnicomecanica: Joi.string().min(10).required(),
    id_linea: Joi.number().integer().required()
})


const bodySchemaFvSeguro = Joi.object({
    fecha_inicio: Joi.string().min(10).required(),
    fecha_fin: Joi.string().min(10).required()
})

const bodySchemaModelo = Joi.object({
    modelo_inicio: Joi.number().min(4).required(),
    modelo_fin: Joi.number().min(4).required()
})

module.exports = { bodySchemaVehiculo, bodySchemaFvSeguro, bodySchemaModelo }