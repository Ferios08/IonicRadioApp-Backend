module.exports = (db) => {
    var yup = require('yup'),
        jwt = require('jsonwebtoken'),
        api = require('express').Router(),
        encrypt = require('../helpers/encryption')

    var loginSchema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required()
    })

    /**
     * @swagger
     * /auth/admins:
     *   post:
     *     description: Login to admin account
     *     tags: [Admins]
     *     parameters:
     *       - name: email
     *       - name: password
     */
    api.post('/admins', (req, res) => {
        loginSchema.validate(req.body).catch((err) => {
            res.status(400).json({ error: err.message })
        }).then(async () =>
            db.query('SELECT name, email, FROM Admins WHERE email = ? and password = ? ', [req.body.email, encrypt(req.body.password)], async (error, result) => {
                if (error) res.status(403).json({ error })
                else if (result.length === 0) res.status(403).json({ error: 'incorrect email or password' })
                else res.json({ ...result[0], token: jwt.sign({ ...result[0], type: 'admin' }, 'no-secret') })
            })
        )
    })

    /**
    * @swagger
    * /auth/users:
    *   post:
    *     description: Login to user account
    *     tags: [Users]
    *     parameters:
    *       - name: email
    *       - name: password
    */
    api.post('/users', async (req, res) => {
        loginSchema.validate(req.body).catch((err) => {
            res.status(400).json({ error: err.message })
        }).then(async () =>
            db.query('SELECT name,id, avatar, lastvu, town, email FROM users WHERE email = ? and password = ? and archived=0', [req.body.email, encrypt(req.body.password)], async (error, result) => {
                if (error) res.status(403).json({ error })
                else if (result.length === 0) res.status(403).json({ error: 'incorrect email or password' })
                else res.json({ ...result[0], token: jwt.sign({ ...result[0], type: 'user' }, 'no-secret'),
                expires_in : 24  *  60  *  60 })
            })
        )
    })



    return api
}