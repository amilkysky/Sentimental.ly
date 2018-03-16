'use strict'
require('dotenv').config()
const { app } = require('./app')
const db = require('../db')
const twitter = require('./api/twitter')
const PORT = process.env.port || 3000

const server = app.listen(PORT, () => {
  console.log('Server is listening on port 3000!')
})

module.exports.server = server
