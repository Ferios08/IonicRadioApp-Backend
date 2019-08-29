module.exports = function (db) {
    return class Log {
        static async Exception(message, endpoint) { return await this.Create('exception', message, endpoint) }
        static async Warning(message, endpoint) { return await this.Create('warning', message, endpoint) }
        static async Info(message, endpoint) { return await this.Create('info', message, endpoint) }

        static Create(type, message, endpoint) {
            return new Promise((resolve, reject) => {
                db.query('INSERT INTO logs (type, message, endpoint) VALUES(?, ?, ?)', [type, message, endpoint], (error, result) => {
                    if (error) resolve(false)
                    else resolve(true)
                })
            })
        }
    }
}
