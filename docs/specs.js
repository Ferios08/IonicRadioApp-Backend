var docs = require('swagger-jsdoc')

module.exports = docs({
    swaggerDefinition: {
        info: {
            title: 'Integ Backend',
        }
    },
    apis: ['./api/*.js']
})