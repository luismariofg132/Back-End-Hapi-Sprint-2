'use strict'
const { pool } = require('../Database/config')
const { bodySchemaMarca } = require('../Schemas/marca')
const { httpStatusDefault, httpStatusMarcaGet, httpStatusMarcasActivas } = require('../Swagger/HttpStatus')

module.exports = {
    name: 'marca',
    version: '1.0.0',
    register: server => {
        // Listar
        server.route({
            method: 'GET',
            path: '/marca',
            handler: async (request, h) => {
                const cliente = await pool.connect()
                try {
                    const query = await cliente.query('SELECT * FROM marca')
                    return query.rows
                } catch (error) {
                    console.log(error)
                    return {
                        message: 'Error al obtener las marcas'
                    }
                } finally {
                    cliente.release(true)
                }
            },
            options: {
                tags: ['api', 'Marca'],
                description: 'Listar todas las marcas',
                plugins: {
                    'hapi-swagger': {
                        responses: httpStatusMarcaGet
                    }
                }
            }
        })
        // Crear
        server.route({
            method: 'POST',
            path: '/marca',
            handler: async (request, h) => {
                const cliente = await pool.connect()
                const { marca_activa, descripcion_marca, nombre_marca } = request.payload
                try {
                    const query = await cliente.query(
                        'INSERT INTO marca (marca_activa, descripcion_marca, nombre_marca) VALUES ($1, $2, $3) RETURNING id_marca', [
                        marca_activa,
                        descripcion_marca,
                        nombre_marca
                    ]);
                    if (query.rowCount > 0) {
                        return {
                            id_marca: query.rows[0].id_marca,
                            marca_activa,
                            descripcion_marca,
                            nombre_marca
                        }
                    } else {
                        return {
                            message: 'Error al crear la marca'
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
                validate: {
                    payload: bodySchemaMarca
                },
                tags: ['api', 'Marca'],
                description: 'Crear una marca',
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
            path: '/marca/{id_marca}',
            handler: async (request, h) => {
                const cliente = await pool.connect()
                const { id_marca } = request.params
                const { marca_activa, descripcion_marca, nombre_marca } = request.payload
                try {
                    const query = await cliente.query(
                        'UPDATE marca SET marca_activa = $1, descripcion_marca = $2, nombre_marca = $3 WHERE id_marca = $4', [
                        marca_activa,
                        descripcion_marca,
                        nombre_marca,
                        id_marca
                    ])
                    if (query.rowCount > 0) {
                        return {
                            id_marca,
                            marca_activa,
                            descripcion_marca,
                            nombre_marca
                        }
                    } else {
                        return {
                            message: 'Error al actualizar la marca'
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
                validate: {
                    payload: bodySchemaMarca
                },
                tags: ['api', 'Marca'],
                description: 'Actualizar una marca',
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
            path: '/marca/{id_marca}',
            handler: async (request, h) => {
                const cliente = await pool.connect()
                const { id_marca } = request.params
                try {
                    const query = await cliente.query(
                        'DELETE FROM marca WHERE id_marca = $1', [
                        id_marca
                    ])
                    if (query.rowCount > 0) {
                        return {
                            message: 'Marca eliminada'
                        }
                    } else {
                        return {
                            message: 'Error al eliminar la marca'
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
                tags: ['api', 'Marca'],
                description: 'Eliminar una marca',
                plugins: {
                    'hapi-swagger': {
                        responses: httpStatusDefault
                    }
                }
            }
        })
        // Trae las marcas activas e inacctivas por separado
        server.route({
            method: 'GET',
            path: '/marca/activas',
            handler: async (request, h) => {
                const cliente = await pool.connect()
                try {
                    const activa = await cliente.query("SELECT * FROM marca WHERE marca_activa = 'si'")
                    const inactiva = await cliente.query("SELECT * FROM marca WHERE marca_activa = 'no'")
                    if (activa.rowCount > 0 || inactiva.rowCount > 0) {
                        return { activas: activa.rows, inactivas: inactiva.rows }
                    } else {
                        return {
                            message: 'Error al obtener las marcas'
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
                tags: ['api', 'Marca'],
                description: 'Listar todas las marcas',
                plugins: {
                    'hapi-swagger': {
                        responses: httpStatusMarcasActivas
                    }
                }
            }
        })
    }
}
