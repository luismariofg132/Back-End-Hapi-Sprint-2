const { SchemaLineaActiva } = require('../Schemas/linea');
const { bodySchemaMarca, SchemaMarcaActiva } = require('../Schemas/marca');
const { bodySchemaVehiculo } = require('../Schemas/vehiculo');

const httpStatusLineasActivas = {
    200: {
        description: 'OK',
        schema: SchemaLineaActiva
    },
    500: {
        description: 'Internal Server Error'
    }
}

const httpStatusMarcasActivas = {
    200: {
        description: 'OK',
        schema: SchemaMarcaActiva
    },
    500: {
        description: 'Internal Server Error'
    }
}

const httpStatusDefault = {
    200: {
        description: 'OK'
    },
    500: {
        description: 'Internal Server Error'
    }
}

const httpStatusMarcaGet = {
    200: {
        description: 'OK',
        schema: bodySchemaMarca
    }
}

const httpStatusVehiculoGet = {
    200: {
        description: 'OK',
        schema: bodySchemaVehiculo
    },
    500: {
        description: 'Internal Server Error'
    }
}

const httpStatusVehiculoModelo = {
    200: {
        description: 'OK',
    },
    500: {
        description: 'Internal Server Error'
    }
}

module.exports = {
    httpStatusLineasActivas, httpStatusDefault, httpStatusMarcaGet, httpStatusMarcasActivas, httpStatusVehiculoGet,
    httpStatusVehiculoModelo
};