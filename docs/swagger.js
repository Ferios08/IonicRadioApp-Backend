var app = require('express').Router()
var ui = require('swagger-ui-express')
var specs = require('./specs')

app.use('/', ui.serve, ui.setup(specs))

module.exports = app