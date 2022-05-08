'use strict'
const { pool } = require('../Database/config')
const { DateCorrection } = require('../Helpers/DateCorrection')
const { bodySchemaFvSeguro, bodySchemaModelo } = require('../Schemas/vehiculo')
const { httpStatusDefault, httpStatusVehiculoModelo } = require('../Swagger/HttpStatus')

module.exports = {
    name: 'vehiculoConsultas',
    version: '1.0.0',
    register: server => {
        // Modelo Mayor y Menor
        server.route({
            method: 'GET',
            path: '/vehiculo/modelos',
            handler: async (request, h) => {
                const cliente = await pool.connect()
                try {
                    const queryModelMax = await cliente.query('SELECT MAX(modelo) Modelo_max  FROM vehiculo;')
                    const queryModelMin = await cliente.query('SELECT MIN(modelo) Modelo_min  FROM vehiculo;')
                    return {
                        Modelo_max: queryModelMax.rows[0].modelo_max,
                        Modelo_min: queryModelMin.rows[0].modelo_min
                    }
                } catch (error) {
                    console.log(error)
                    return {
                        message: 'Error al obtener los modelos'
                    }
                } finally {
                    cliente.release(true)
                }
            },
            options: {
                tags: ['api', 'Vehiculo'],
                description: 'Listar el modelo mayor y menor',
                plugins: {
                    'hapi-swagger': {
                        responses: httpStatusDefault
                    }
                }
            }
        })
        // Consulta por un rango de fecha de vencimiento del seguro
        server.route({
            method: 'POST',
            path: '/vehiculo/modelos',
            handler: async (request, h) => {
                const { fecha_inicio, fecha_fin } = request.payload
                const cliente = await pool.connect()
                try {
                    const query = await cliente.query('SELECT * FROM vehiculo WHERE fv_seguro BETWEEN $1 AND $2', [
                        fecha_inicio, fecha_fin])

                    if (query.rowCount > 0) {
                        const vehiculo = DateCorrection(query.rows)
                        return vehiculo
                    } else {
                        return {
                            message: 'No hay vehiculos con ese rango de fecha'
                        }
                    }
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
                validate: {
                    payload: bodySchemaFvSeguro
                },
                tags: ['api', 'Vehiculo'],
                description: 'Listar los vehiculos por un rango de fecha de vencimiento del seguro',
                plugins: {
                    'hapi-swagger': {
                        responses: httpStatusVehiculoModelo
                    }
                }
            }
        })
        // Suma y promedia los modelos
        server.route({
            method: 'GET',
            path: '/vehiculo/promedioSuma',
            handler: async (request, h) => {
                const cliente = await pool.connect()
                try {
                    const suma = await cliente.query('SELECT SUM(modelo) modelo_suma FROM vehiculo;')
                    const promedio = await cliente.query('SELECT AVG(modelo) modelo_promedio FROM vehiculo;')
                    const promedioRoud = Math.round((Number(promedio.rows[0].modelo_promedio) + Number.EPSILON) * 100) / 100;
                    return {
                        modelo_suma: suma.rows[0].modelo_suma,
                        modelo_promedio: promedioRoud
                    }
                } catch (error) {
                    console.log(error)
                    return {
                        message: 'Error al obtener los modelos'
                    }
                } finally {
                    cliente.release(true)
                }
            },
            options: {
                tags: ['api', 'Vehiculo'],
                description: 'Listar el promedio y suma de los modelos',
                plugins: {
                    'hapi-swagger': {
                        responses: httpStatusDefault
                    }
                }
            }
        })
        // Trae solo los vehiculos los cuales tengan la linea activa
        server.route({
            method: 'GET',
            path: '/vehiculo/lineaActiva',
            handler: async (request, h) => {
                const cliente = await pool.connect()
                try {
                    const query = await cliente.query("SELECT placa, modelo, descripcion_linea, descripcion_marca FROM vehiculo INNER JOIN linea ON vehiculo.id_linea = linea.id_linea INNER JOIN marca ON linea.id_marca = marca.id_marca WHERE linea_activa = 'si';                    ")
                    if (query.rowCount > 0) {
                        return query.rows
                    } else {
                        return {
                            message: 'Error al obtener los datos'
                        }
                    }

                } catch (error) {
                    console.log(error)
                    return {
                        message: 'Error al obtener los datos'
                    }
                } finally {
                    cliente.release(true)
                }
            },
            options: {
                tags: ['api', 'Vehiculo'],
                description: 'Listar los vehiculos con la linea activa',
                plugins: {
                    'hapi-swagger': {
                        responses: httpStatusDefault
                    }
                }
            }
        })
        // Cuenta los vehiculos que estan activos e innactivos de la tabla linea
        server.route({
            method: 'GET',
            path: '/vehiculo/lineaActiva/count',
            handler: async (request, h) => {
                const cliente = await pool.connect()
                try {
                    const active = await cliente.query("SELECT COUNT(linea_activa) FROM vehiculo INNER JOIN linea ON vehiculo.id_linea = linea.id_linea WHERE linea_activa = 'si';")
                    const inactive = await cliente.query("SELECT COUNT(linea_activa) FROM vehiculo INNER JOIN linea ON vehiculo.id_linea = linea.id_linea WHERE linea_activa = 'no';")
                    return {
                        active: active.rows[0].count,
                        inactive: inactive.rows[0].count
                    }
                } catch (error) {
                    console.log(error)
                    return {
                        message: 'Error al obtener los datos'
                    }
                } finally {
                    cliente.release(true)
                }
            },
            options: {
                tags: ['api', 'Vehiculo'],
                description: 'Listar los vehiculos con la linea activa',
                plugins: {
                    'hapi-swagger': {
                        responses: httpStatusDefault
                    }
                }
            }
        })
        // Consultar vehiculos por un rango de modelos
        server.route({
            method: 'POST',
            path: '/vehiculo/modelos/range',
            handler: async (request, h) => {
                const { modelo_inicio, modelo_fin } = request.payload
                const cliente = await pool.connect()
                try {
                    const query = await cliente.query('SELECT * FROM vehiculo WHERE modelo BETWEEN $1 AND $2', [
                        modelo_inicio, modelo_fin
                    ])
                    if (query.rowCount > 0) {
                        const vehiculo = DateCorrection(query.rows)
                        return vehiculo
                    } else {
                        return {
                            message: 'No hay vehiculos con ese rango de modelos'
                        }
                    }
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
                validate: {
                    payload: bodySchemaModelo
                },
                tags: ['api', 'Vehiculo'],
                description: 'Listar los vehiculos por un rango de modelos',
                plugins: {
                    'hapi-swagger': {
                        responses: httpStatusVehiculoModelo
                    }
                }
            }
        })
    }
}