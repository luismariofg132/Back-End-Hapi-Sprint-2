const Joi = require('joi');

const bodySchemaLinea = Joi.object({
    linea_activa: Joi.string().valid('si', 'no').required(),
    descripcion_linea: Joi.string().max(100).required(),
    id_marca: Joi.number().integer().required(),
    nombre_linea: Joi.string().max(100).required()
})

const SchemaLineaActiva = Joi.object({
    activas: [{
        id_linea: Joi.number().integer().required(),
        linea_activa: Joi.string().valid('si', 'no').required(),
        descripcion_linea: Joi.string().max(100).required(),
        id_marca: Joi.number().integer().required(),
        nombre_linea: Joi.string().max(100).required()
    }],
    inactivas: [{
        id_linea: Joi.number().integer().required(),
        linea_activa: Joi.string().valid('si', 'no').required(),
        descripcion_linea: Joi.string().max(100).required(),
        id_marca: Joi.number().integer().required(),
        nombre_linea: Joi.string().max(100).required()
    }]
})

module.exports = { bodySchemaLinea, SchemaLineaActiva }