'use strict'
const express = require('express')

const path = require('path')
const middleware = require('./middleware')

const app = express()
module.exports.app = app

const csp = require(`helmet-csp`)

function getDirectives () {
  const self = `'self'`
  const unsafeInline = `'unsafe-inline'`
  const styles = [
    `//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css`,
    `//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css`
  ]
  const fonts = [
    `//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css`
  ]
  const images = [
    `https:`,
    `data:`
  ]
  const connect = [
    `https://stream.twitter.com/`
  ]

  return {
    defaultSrc: [self],
    scriptSrc: [self],
    styleSrc: [self, unsafeInline, ...styles],
    fontSrc: [self, ...fonts],
    frameSrc: [self],
    connectSrc: [self],
    imgSrc: [self, ...images],
    objectSrc: [self],
    reportUri: `/api/csp/report`
  }
}


app.use(middleware.morgan('dev'))
app.use(middleware.cookieParser())
app.use(middleware.bodyParser.urlencoded({extended: false}))
app.use(middleware.bodyParser.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(csp({directives: getDirectives()}))
app.use(middleware.auth.session)
app.use(middleware.passport.initialize())
app.use(middleware.passport.session())
app.use(middleware.flash())

app.use(express.static(path.join(__dirname, '../public')))

const routes = require('./routes')

app.use('/', routes.auth)
app.use('/api', routes.api)
app.use('/api/profiles', routes.profiles)
