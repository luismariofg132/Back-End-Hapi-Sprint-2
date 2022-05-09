'use strict'
const { pool } = require('../Database/config')
const { handleFileUpload, deleteFile } = require('../CloudStorage/Storage')
const { DateCorrection } = require('../Helpers/DateCorrection')
const { httpStatusVehiculoGet, httpStatusDefault } = require('../Swagger/HttpStatus')

module.exports = {
    name: 'vehiculo',
    version: '1.0.0',
    register: server => {
        // Listar
        server.route({
            method: 'GET',
            path: '/vehiculo',
            handler: async (request, h) => {
                const cliente = await pool.connect()
                try {
                    const query = await cliente.query('SELECT * FROM vehiculo')
                    const vehiculo = DateCorrection(query.rows)
                    return vehiculo
                } catch (error) {
                    console.log(error)
                    return {
                        message: 'Error al obtener los vehiculos'
                    }
                } finally {
                    cliente.release(true)
                }
            },
            options: {
                tags: ['api', 'Vehiculo'],
                description: 'Listar todos los vehiculos',
                plugins: {
                    'hapi-swagger': {
                        responses: httpStatusVehiculoGet
                    }
                }
            }
        })
        // Crear
        server.route({
            method: 'POST',
            path: '/vehiculo',
            handler: async (request, h) => {
                const { url_image, placa, modelo, fv_seguro, fv_tecnicomecanica, id_linea, } = request.payload
                const url = await handleFileUpload(url_image, placa)
                const cliente = await pool.connect()
                try {
                    const query = await cliente.query('INSERT INTO vehiculo (url_image, placa, modelo, fv_seguro, fv_tecnicomecanica, id_linea) VALUES ($1, $2, $3, $4, $5, $6)', [
                        url, placa, modelo, fv_seguro, fv_tecnicomecanica, id_linea
                    ])
                    if (query.rowCount > 0) {
                        return {
                            url,
                            placa,
                            modelo,
                            fv_seguro,
                            fv_tecnicomecanica,
                            id_linea
                        }
                    } else {
                        return {
                            message: 'Error al crear el vehiculo'
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
                payload: {
                    multipart: true,
                    output: 'stream',
                },
                tags: ['api', 'Vehiculo'],
                description: 'Crear un vehiculo',
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
            path: '/vehiculo/{placa}',
            handler: async (request, h) => {
                const { placa } = request.params
                const { modelo, fv_seguro, fv_tecnicomecanica, id_linea, } = request.payload
                const cliente = await pool.connect()
                try {
                    const query = await cliente.query('UPDATE vehiculo SET modelo = $1, fv_seguro = $2, fv_tecnicomecanica = $3, id_linea = $4 WHERE placa = $5', [
                        modelo, fv_seguro, fv_tecnicomecanica, id_linea, placa
                    ])
                    if (query.rowCount > 0) {
                        return {
                            message: 'Vehiculo actualizado'
                        }
                    } else {
                        return {
                            message: 'Error al actualizar el vehiculo'
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
                tags: ['api', 'Vehiculo'],
                description: 'Actualizar un vehiculo',
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
            path: '/vehiculo/{placa}',
            handler: async (request, h) => {
                const { placa } = request.params
                const cliente = await pool.connect()
                try {
                    const queryVehiculo = await cliente.query('SELECT url_image FROM vehiculo WHERE placa = $1', [placa])
                    const url_image = queryVehiculo.rows[0].url_image
                    const name_file = url_image.split('/')[url_image.split('/').length - 1]
                    const query = await cliente.query('DELETE FROM vehiculo WHERE placa = $1', [placa])
                    if (query.rowCount > 0) {
                        const deleteFileFun = await deleteFile(name_file)
                        if (deleteFileFun) {
                            return {
                                message: 'Vehiculo eliminado'
                            }
                        }
                    } else {
                        return {
                            message: 'Error al eliminar el vehiculo'
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
                tags: ['api', 'Vehiculo'],
                description: 'Eliminar un vehiculo',
                plugins: {
                    'hapi-swagger': {
                        responses: httpStatusDefault
                    }
                }
            }
        })
    }
}