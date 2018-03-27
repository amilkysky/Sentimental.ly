'use strict'
require('dotenv').config()
const { app } = require('./app')
const db = require('../db')
const twitter = require('./api/twitter')
const http = require('http')

const server = http.createServer(app)
server.listen(process.env.PORT)
server.on('Listening', () => {console.log(`Server listening on port ${PORT}`)})

module.exports.server = server
