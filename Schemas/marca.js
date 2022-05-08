const Joi = require('joi');

const bodySchemaMarca = Joi.object({
    marca_activa: Joi.string().valid('si', 'no').required(),
    descripcion_marca: Joi.string().max(100).required(),
    nombre_marca: Joi.string().max(50).required()
})

const SchemaMarcaActiva = Joi.object({
    activas: [{
        id_marca: Joi.number().integer().required(),
        marca_activa: Joi.string().valid('si', 'no').required(),
        descripcion_marca: Joi.string().max(100).required(),
        nombre_marca: Joi.string().max(50).required()
    }],
    inactivas: [{
        id_marca: Joi.number().integer().required(),
        marca_activa: Joi.string().valid('si', 'no').required(),
        descripcion_marca: Joi.string().max(100).required(),
        nombre_marca: Joi.string().max(50).required()
    }]
})
module.exports = { bodySchemaMarca, SchemaMarcaActiva }