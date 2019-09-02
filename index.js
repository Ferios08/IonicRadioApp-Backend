var compression = require('compression'),
    logger = require('./helpers/logger'),
    db = require('./helpers/database'),
    parser = require('body-parser'),
    jwt = require('jsonwebtoken'),
    express = require('express'),
    morgan = require('morgan'),
    cors = require('cors')

var app = express(),
    swagger = require('./docs/swagger'),
    port = process.env.PORT || 1338

app.set('port', port)
app.use(cors())
app.use(compression())
app.use(parser.json())
app.use(parser.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('common'))
}

app.use('/docs', swagger)
app.get('/', (req, res) => { res.json('Welcome to behind-the-scenes side of afflo.tn') })
app.get('/healthz', (req, res) => { res.status(200).json({ status: 'ready' }) })

app.all('*', (req, res, next) => {
    var token = req.headers['authorization'] !== undefined && req.headers['authorization'].substr(7),
        url = req.url.replace(/[/]+/g, '/'),
        origin = req.get('origin')

    var openRoutes = [
        { path: '/auth/users', method: '*'},
        { path: '/users', method: '*' },
        { path: '/customers', method: 'POST' },
        { path: '/admins', method: 'POST' },
        { path: '/public', method: '*' }
    ]

    if (openRoutes.filter(route => route.path.indexOf(url) != -1 && (route.method == '*' || route.method == req.method)).length > 0) {
        next()
    } else {
        if (token) {
            jwt.verify(token, 'no-secret', (err, decoded) => {
                if (err) {
                    throw { error: 'authorization token is invalid', code: 403 }
                } else {
                    req.backend = {
                        origin,
                        id: decoded.id, // account id
                        type: decoded.type
                    }
                    next()
                }
            })
        } else {
            throw { error: 'authorization token is required', code: 401 }
        }
    }
})

app.use('/auth', require('./api/auth')(db))
//app.use('/admins', require('./api/admins')(db))
app.use('/users', require('./api/users')(db))


app.all('/*', (req, res) => { throw ({ error: 'requested endpoint does not exist', code: 400 }) })

app.use(async (err, req, res, next) => {
    await logger(db).Warning(err.error, req.path)
    res.status(err.code || 500).json(err)
})

app.listen(app.get('port'))
console.log(`server is listening on ${port}`)

module.exports = app
