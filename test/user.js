process.env.NODE_ENV = 'test'

var server = require('../index'),
    http = require('chai-http'),
    chai = require('chai')

chai.should()
chai.use(http)

describe('Users API', function () {
    it('user should succeed to register', function (done) {
        chai.request(server)
            .post('/users')
            .send({
                name: "John" + Date.now(),
                email: 'user' + Date.now() + '@mail.com',
                password: '12345678'

            })
            .end(function (err, res) {
                res.should.have.status(200)
                done()
            })
    })


    describe('Users API', function () {
        it('user should fail to register', function (done) {
            chai.request(server)
                .post('/users')
                .send({
                    name: "John" + Date.now(),
                    email: 'ferios@mail.com',
                    password: '12345678'

                })
                .end(function (err, res) {
                    res.should.have.status(400)
                    done()
                })
        })
        

      
    })
})