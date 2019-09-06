module.exports = (db) => {
    var api = require('express').Router()

    /**
     * @swagger
     * /movies:
     *   post:
     *     description: create a new movie
     *     tags: [Movies]
     *     parameters:
     *       - name: name
     *       - name: duration
     *       - name: year
     */
    api.post('/', async (req, res) => {
        try {
            movies = require('../models/movie')(db, req.backend)
            res.json(await movies.Create(req.body))
        } catch (err) {
            res.status(err.code || 500).json(err)
        }
    })

    /**
     * @swagger
     * /movies/id:
     *   get:
     *     description: get movie by id
     *     tags: [Movies]
     */
    api.get('/:id', async (req, res) => {
        try {
            movies = require('../models/movie')(db, req.backend)
            res.json(await movies.Get(req.params.id))
        } catch (err) {
            res.status(err.code || 500).json(err)
        }
    })


     /**
     * @swagger
     * /movies/id:
     *   get:
     *     description: get movie by id
     *     tags: [Movies]
     */
    api.get('/byuser/:id', async (req, res) => {
        try {
            movies = require('../models/movie')(db, req.backend)
            res.json(await movies.Getbyuser(req.params.id))
        } catch (err) {
            res.status(err.code || 500).json(err)
        }
    })

    
    /**
     * @swagger
     * /movies/id:
     *   delete:
     *     description: deleting a movie
     *     tags: [Movies]
     */
    api.delete('/:id', async (req, res) => {
        try {
            movies = require('../models/movie')(db, req.backend)
            res.json(await movies.Delete(req.params.id))
        } catch (err) {
            res.status(err.code || 500).json(err)
        }
    })

    /**
      * @swagger
      * /movies:
      *   get:
      *     description: get all movies
      *     tags: [Movies]
      */
    api.get('/', async (req, res) => {
        try {
            movies = require('../models/movie')(db, req.backend)
            res.json(await movies.All())
        } catch (err) {
            res.status(501).json({ error: 'cannot get all movies' })
        }
    })


    /*implemented routes*/
    api.all('*', async (req, res) => {
        res.status(501).json({ error: 'endpoint not implemented yet' })
    })

    return api
}