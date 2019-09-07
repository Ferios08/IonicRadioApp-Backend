process.env.NODE_ENV = 'test'

var server = require('../server'),
    http = require('chai-http'),
    chai = require('chai')

chai.should()
chai.use(http)

describe('Auth API', function () {
    it('user should succeed to sign in', function (done) {
        chai.request(server)
            .post('/auth/users')
            .send({
                email: 'ferios@mail.com',
                password: '12345678'
                
            })
            .end(function (err, res) {
                res.should.have.status(200)
                done()
            })
    })

    it('user should fail to sign in', function (done) {
        chai.request(server)
            .post('/auth/users')
            .send({
                email: 'firas@user.com',
                password: '1234567'
            })
            .end(function (err, res) {
                res.should.have.status(403)
                done()
            })
    })
})
