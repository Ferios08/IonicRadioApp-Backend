module.exports = (db, headers) => {
    var yup = require('yup'),
        jwt = require('jsonwebtoken'),
        encrypt = require('../helpers/encryption')



    var createSchema = yup.object().shape({
        user_id: yup.string().required(),
        name: yup.string().required(),
        duration: yup.string().required(),
        year: yup.string().required()
    })






    return class Movie {


        /** Get an existing movie account by id */
        static Get(id) {
            return new Promise((resolve, reject) => {
                db.query('SELECT * FROM movies WHERE id = ?', [id], (error, result) => {
                    if (error) reject({ error, code: '500' })
                    else if (result.length === 0) reject({ error: 'movie does not exist', code: '404' })
                    else {
                        var result = result[0]
                        delete result.password
                        resolve(result)
                    }
                })
            })
        }

         /** Get an existing movie account by userid */
         static Getbyuser(user) {
            return new Promise((resolve, reject) => {
                db.query('SELECT * FROM movies WHERE user_id = ?', [user], (error, result) => {
                    if (error) reject({ error, code: '500' })
                    else if (result.length === 0) reject({ error: 'movies does not exist', code: '404' })
                    else {
                         resolve(result)
                    }
                })
            })
        }

        /** Create a new movie */
        static Create(data) {
            return new Promise(async (resolve, reject) => {
                try {
                    await createSchema.validate(data)
                    db.query('INSERT INTO movies (user_id,name,duration,year) VALUES(?,?,?,?)', [data.user_id, data.name, data.duration, data.year], (error, result) => {
                        if (error) reject({ error, code: '500' })
                        else {
                            resolve(result)
                        }
                    })
                } catch (error) { reject({ error: error.message, code: '400' }) }
            })
        }

        /** Check if a movie exist or not by id */
        static Exist(id) {
                return new Promise((resolve, reject) => {
                    db.query('SELECT * FROM movies WHERE id = ? ', [id], (error, result) => {
                        if (error || result.length === 0) resolve(false)
                        else resolve(true)
                    })
                })
            }

        /** Delete a movie account */
        static Delete(id) {
                return new Promise(async (resolve, reject) => {
                    if (!(await this.Exist(id))) reject({ error: 'this movie does not exist', code: 404 })
                    else {
                        db.query('delete from movies where id = ?', [id], function (error, result) {
                            if (error) reject({ error, code: '500' })
                            else resolve({ result: 'movie deleted' })
                        })
                    }
                })
            }

        /* get movies  list*/
        static All() {
                return new Promise((resolve, reject) => {
                    db.query('SELECT * FROM movies  ', (error, result) => {
                        if (error) reject({ error, code: '500' })
                        else if (result.length === 0) reject({ error: 'There are no movies', code: '404' })
                        else {
                            resolve(result)
                        }
                    })
                })
            }
    }
    }