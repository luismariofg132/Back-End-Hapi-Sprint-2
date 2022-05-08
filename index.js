const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const laabr = require('laabr');
const HapiSwagger = require('hapi-swagger')
const swaggerOptions = require('./Swagger/SwaggerOptions')
require('dotenv').config();

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: 'localhost',
        // routes: {
        //     cors: true
        // }
    })


    await server.register([
        Inert, Vision, {
            plugin: laabr,
            options: {}
        },
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    await server.register([
        require('./Routes/marca'),
        require('./Routes/linea'),
        require('./Routes/vehiculo'),
        require('./Routes/querys')
    ])

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Esta es la API'
        }
    })

    await server.start()
    console.log('Server running on %s', server.info.uri)
}

init()