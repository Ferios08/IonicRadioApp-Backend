module.exports = (db, headers) => {
    var yup = require('yup'),
        jwt = require('jsonwebtoken'),
        encrypt = require('../helpers/encryption')

    var loginSchema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().min(8).required()
    })

    var createSchema = yup.object().shape({

        name: yup.string().required(),
        email: yup.string().email().required(),
        password: yup.string().min(8).required()
    })

    var updateSchema = yup.object().shape({
        name: yup.string(),
        email: yup.string().email()

    })

    return class User {

        /** Login to user's account */
        static Login(data) {
            return new Promise(async (resolve, reject) => {
                try {
                    await loginSchema.validate(data)
                    db.query('select u.id, u.name,u.email from users u where u.email = ? AND u.password = ?', [data.email, encrypt(data.password)], (error, result) => {
                        if (error) reject({ error, code: '500' })
                        else if (result.length === 0) reject({ error: 'incorrect email or password', code: 403 })
                        else resolve({ ...result[0], token: jwt.sign({ ...result[0], type: 'user' }, 'no-secret') })
                    })
                } catch (error) { reject({ error: error.message, code: '400' }) }
            })
        }

        /** Get an existing user account by id */
        static Get(id) {
            return new Promise((resolve, reject) => {
                db.query('SELECT * FROM users WHERE id = ?', [id], (error, result) => {
                    if (error) reject({ error, code: '500' })
                    else if (result.length === 0) reject({ error: 'user does not exist', code: '404' })
                    else {
                        var result = result[0]
                        delete result.password
                        resolve(result)
                    }
                })
            })
        }

        /** Create a new user account */
        static Create(data) {
            return new Promise(async (resolve, reject) => {
                try {
                    await createSchema.validate(data)
                    if (await this.EmailUsed(data.email)) {
                        reject({ error: 'The specified email is already used', code: '400' })
                    } else {
                        db.query('INSERT INTO users (name,email,password) VALUES(?,?,?)', [data.name, data.email, encrypt(data.password)], (error) => {
                            if (error) reject({ error, code: '500' })
                            else this.Login({ email: data.email, password: data.password }).then(resolve).catch(reject)
                        })

                    }
                } catch (error) { reject({ error: error.message, code: '400' }) }
            })
        }

        /** Check if a user exist or not by email */
        static EmailUsed(email) {
            return new Promise((resolve, reject) => {
                db.query("SELECT * FROM users WHERE email = ?", [email], (error, result) => {
                    if (error || result.length === 0) resolve(false)
                    else resolve(true)
                })
            })
        }

        /** Update an existing user account */
        static Update(id, data) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (!(await this.Exist(id))) reject({ error: 'this user does not exist', code: 404 })
                    else if (!(await this.CanAccess(id))) reject({ error: 'you cannot update this user', code: 403 })
                    else {
                        await updateSchema.validate(data)
                        db.query("UPDATE users SET name=?, email = ? WHERE id = ? ", [data.name, data.email, id], async (error, result) => {
                            if (error) reject({ error, code: '500' })
                            else {
                                resolve(await this.Get(id))
                            }
                        })
                    }
                } catch (error) { reject({ error: error.message, code: '400' }) }
            })
        }

        /** Check if a user has permissions to update or delete an account */
        static CanAccess(id) {
            return new Promise((resolve, reject) => {
                resolve(id == headers.id && headers.type == 'user')
            })
        }

        /** Check if a user exist or not by id */
        static Exist(id) {
            return new Promise((resolve, reject) => {
                db.query('SELECT * FROM users WHERE id = ?', [id], (error, result) => {
                    if (error || result.length === 0) resolve(false)
                    else resolve(true)
                })
            })
        }

        /** Delete a user account */
        static Delete(id) {
            return new Promise(async (resolve, reject) => {
                if (!(await this.Exist(id))) reject({ error: 'this user does not exist', code: 404 })
                else if (!(await this.CanAccess(id))) reject({ error: 'you cannot delete this user', code: 403 })
                else {
                    db.query('UPDATE users SET archived = 1 where id = ?', [id], function (error, result) {
                        if (error) reject({ error, code: '500' })
                        else resolve({ result: 'user deleted' })
                    })
                }
            })
        }

        /* get users  list*/
        static All() {
            return new Promise((resolve, reject) => {
                db.query('SELECT * FROM users where archived=0 ', (error, result) => {
                    if (error) reject({ error, code: '500' })
                    else if (result.length === 0) reject({ error: 'There are no users', code: '404' })
                    else {
                        resolve(result)
                    }
                })
            })
        }
    }
}