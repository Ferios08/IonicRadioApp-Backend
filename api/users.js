module.exports = (db) => {
    var api = require('express').Router()

    /**
     * @swagger
     * /users:
     *   post:
     *     description: create a new user
     *     tags: [Users]
     *     parameters:
     *       - name: name
     *       - name: email
     *       - name: password
     */
    api.post('/', async (req, res) => {
        try {
            users = require('../models/user')(db, req.backend)
            res.json(await users.Create(req.body))
        } catch (err) {
            res.status(err.code || 500).json(err)
        }
    })

    /**
     * @swagger
     * /users/id:
     *   get:
     *     description: get user by id
     *     tags: [Users]
     */
    api.get('/:id', async (req, res) => {
        try {
            users = require('../models/user')(db, req.backend)
            res.json(await users.Get(req.params.id))
        } catch (err) {
            res.status(err.code || 500).json(err)
        }
    })

    /**
     * @swagger
     * /users/:id:
     *   put:
     *     description: Updating an user's account
     *     tags: [Users]
     *     parameters:
     *       - name: name
     *       - name: email
     */
    api.put('/:id', async (req, res) => {
        try {
            users = require('../models/user')(db, req.backend)
            res.json(await users.Update(req.params.id, req.body))
        } catch (err) {
            res.status(err.code || 500).json(err)
        }
    })

    /**
     * @swagger
     * /users/id:
     *   delete:
     *     description: deleting a user's account
     *     tags: [Users]
     */
    api.delete('/:id', async (req, res) => {
        try {
            users = require('../models/user')(db, req.backend)
            res.json(await users.Delete(req.params.id))
        } catch (err) {
            res.status(err.code || 500).json(err)
        }
    })

    /**
      * @swagger
      * /users:
      *   get:
      *     description: get all users
      *     tags: [Users]
      */
    api.get('/', async (req, res) => {
        try {
            users = require('../models/user')(db, req.backend)
            res.json(await users.All())
        } catch (err) {
            res.status(501).json({ error: 'cannot get all users' })
        }
    })


    /*implemented routes*/
    api.all('*', async (req, res) => {
        res.status(501).json({ error: 'endpoint not implemented yet' })
    })

    return api
}