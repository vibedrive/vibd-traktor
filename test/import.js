var test = require('tape')
var path = require('path')
var os = require('os')
var middleware = require('../.')
var runSeries = require('run-series')

var app = {
  _middleware: [],
  use: function (middleware) {
    this._middleware.push(middleware)
  },
  import: function (opts) {
    var jobs = this._middleware.map(middleware => done => middleware(app, opts, done))

    runSeries(jobs, function () {
      console.log('done important')
    })
  },
  _add: function (item, callback) {
    this.getUnusedId(id => {
      callback(null, id)
    })
  },
  getUnusedId: function (callback) {
    var id = Math.floor(Math.random() * Math.floor(999))
    callback(id)
  },
  Item: {
    from: function (filepath) {
      var item = {
        source: {
          type: 'file',
          payload: filepath
        }
      }

      return item
    }
  }
}

var opts = {
  type: 'traktor',
  source: {
    type: 'file',
    payload: path.join(os.homedir(), '/Documents/Native\\ Instruments/Traktor\\ 2.11.0/collections.nml')
  }
}

app.use(middleware)

test('dont crash please', function (assert) {
  assert.doesNotThrow(function () {
    app.import(opts)
  })
  assert.end()
})
