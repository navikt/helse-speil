'use strict'

const prometheus = require('prom-client')

const setup = (app) => {
    prometheus.collectDefaultMetrics({ timeout: 5000 })
    app.get('/metrics', (req, res) => {
      res.set('Content-Type', prometheus.register.contentType)
      res.end(prometheus.register.metrics())
    })
}

module.exports = {
    setup: setup
}