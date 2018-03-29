'use strict'
const express = require('express')

const path = require('path')
const middleware = require('./middleware')

const app = express()
module.exports.app = app

const csp = require(`helmet-csp`)

app.use(middleware.morgan('dev'))
app.use(middleware.cookieParser())
app.use(middleware.bodyParser.urlencoded({extended: false}))
app.use(middleware.bodyParser.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(csp({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ['style.com', "'unsafe-inline'"],
    fontSrc: ["'self'"],
    imgSrc: ['self', 'data:'],
    sandbox: ['allow-forms', 'allow-scripts'],
    reportUri: '/report-violation',
    objectSrc: ["'none'"],
    upgradeInsecureRequests: true,
    workerSrc: false
  },
  loose: true,
  reportOnly: true,
  setAllHeaders: false,
  disableAndroid: true,
  browserSniff: true
}))

app.use(middleware.auth.session)
app.use(middleware.passport.initialize())
app.use(middleware.passport.session())
app.use(middleware.flash())

app.use(express.static(path.join(__dirname, '../public')))

const routes = require('./routes')

app.use('/', routes.auth)
app.use('/api', routes.api)
app.use('/api/profiles', routes.profiles)
