'use strict'
const { pool } = require('../Database/config')
const { bodySchemaLinea } = require('../Schemas/linea')
const { httpStatusLineasActivas, httpStatusDefault } = require('../Swagger/HttpStatus')

module.exports = {
    name: 'linea',
    version: '1.0.0',
    register: server => {
        // Listar
        server.route({
            method: 'GET',
            path: '/linea',
            handler: async (request, h) => {
                const cliente = await pool.connect()
                try {
                    const query = await cliente.query('SELECT * FROM linea')
                    return query.rows
                } catch (error) {
                    console.log(error)
                    return {
                        message: 'Internal Server Error'
                    }.code(500)
                } finally {
                    cliente.release(true)
                }
            },
            options: {
                tags: ['api', 'Linea'],
                description: 'Listar todas las lineas',
            }
        })
        // Crear
        server.route({
            method: 'POST',
            path: '/linea',
            handler: async (request, h) => {
                const cliente = await pool.connect()
                const { linea_activa, descripcion_linea, id_marca, nombre_linea } = request.payload
                try {
                    const query = await cliente.query(
                        'INSERT INTO linea (linea_activa, descripcion_linea, id_marca, nombre_linea) VALUES ($1, $2, $3, $4) RETURNING id_linea', [
                        linea_activa,
                        descripcion_linea,
                        id_marca,
                        nombre_linea
                    ]
                    )
                    if (query.rowCount > 0) {
                        return {
                            id_linea: query.rows[0].id_linea,
                            linea_activa,
                            descripcion_linea,
                            id_marca,
                            nombre_linea
                        }
                    } else {
                        return {
                            message: 'Error al crear la linea'
                        }.code(500)
                    }
                } catch (error) {
                    console.log(error)
                    return { "message": "Internal Server Error" }.code(500)
                } finally {
                    cliente.release(true)
                }
            },
            options: {
                tags: ['api', 'Linea'],
                description: 'Crear una linea',
                validate: {
                    payload: bodySchemaLinea
                },
                plugins: {
                    'hapi-swagger': {
                        responses: httpStatusDefault
                    }
                }
            }
        })
        // Actualizar
        server.route({
            method: 'PUT',
            path: '/linea/{id_linea}',
            handler: async (request, h) => {
                const cliente = await pool.connect()
                const { id_linea } = request.params
                const { linea_activa, descripcion_linea, id_marca, nombre_linea } = request.payload
                try {
                    const query = await cliente.query(
                        'UPDATE linea SET linea_activa = $1, descripcion_linea = $2, id_marca = $3, nombre_linea = $4 WHERE id_linea = $5', [
                        linea_activa,
                        descripcion_linea,
                        id_marca,
                        nombre_linea,
                        id_linea
                    ])
                    if (query.rowCount > 0) {
                        return {
                            id_linea,
                            linea_activa,
                            descripcion_linea,
                            id_marca,
                            nombre_linea
                        }
                    } else {
                        return {
                            message: 'Error al actualizar la linea'
                        }
                    }
                } catch (error) {
                    console.log(error)
                    return { "message": "Internal Server Error" }
                } finally {
                    cliente.release(true)
                }
            },
            options: {
                tags: ['api', 'Linea'],
                description: 'Actualizar una linea',
                validate: {
                    payload: bodySchemaLinea
                },
                plugins: {
                    'hapi-swagger': {
                        responses: httpStatusDefault
                    }
                }
            }
        })
        // Eliminar
        server.route({
            method: 'DELETE',
            path: '/linea/{id_linea}',
            handler: async (request, h) => {
                const cliente = await pool.connect()
                const { id_linea } = request.params
                try {
                    const query = await cliente.query(
                        'DELETE FROM linea WHERE id_linea = $1', [
                        id_linea
                    ])
                    if (query.rowCount > 0) {
                        return {
                            message: 'Linea eliminada'
                        }
                    } else {
                        return {
                            message: 'Error al eliminar la linea'
                        }.code(500)
                    }
                } catch (error) {
                    console.log(error)
                    return { "message": "Internal Server Error" }.code(500)
                } finally {
                    cliente.release(true)
                }
            },
            options: {
                tags: ['api', 'Linea'],
                description: 'Eliminar una linea',
                plugins: {
                    'hapi-swagger': {
                        responses: httpStatusDefault
                    }
                }
            }
        })
        // Trae las lineas activas e inactivas por separado
        server.route({
            method: 'GET',
            path: '/linea/activas',
            handler: async (request, h) => {
                const cliente = await pool.connect()
                try {
                    const activa = await cliente.query("SELECT * FROM linea WHERE linea_activa = 'si'")
                    const inactiva = await cliente.query("SELECT * FROM linea WHERE linea_activa = 'no'")
                    if (activa.rowCount > 0 || inactiva.rowCount > 0) {
                        return { activas: activa.rows, inactivas: inactiva.rows }
                    }
                } catch (error) {
                    console.log(error)
                    return { "message": "Internal Server Error" }
                } finally {
                    cliente.release(true)
                }
            },
            options: {
                tags: ['api', 'Linea'],
                description: 'Trae las lineas activas e inactivas por separado',
                plugins: {
                    'hapi-swagger': {
                        responses: httpStatusLineasActivas
                    }
                }
            }
        })
    }
}