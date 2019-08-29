module.exports = function (password) {
    var crypto = require('crypto')
    var SECRET = 'MyXRv6k0ME9n1Z3', ALGORITHM = 'AES-256-CBC'
    let hash = crypto.createHmac('sha256', SECRET).digest('base64')
    let cipher = crypto.createCipher(ALGORITHM, hash)
    let output = cipher.update(password, 'utf8', 'base64') + cipher.final('base64')
    return output
}
