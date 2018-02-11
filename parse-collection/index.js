var Collection = require('../Collection')

if (require.main === module) {
  var filepath = process.argv[2]

  if (filepath) {
    parseCollection(filepath, out)
  } else {
    parseCollection(out)
  }
} else {
  module.exports = parseCollection
}

function out (err, obj) {
  if (err) return process.stderr.write(err)
  process.stdout.write(JSON.stringify(obj, null, 2))
}

function parseCollection (filepath, callback) {
  var pathToCollectionFile

  if (typeof callback !== 'function') {
    // filepath is the callback
    callback = filepath
  }

  var collection = Collection()

  collection.onLoad = function () {
    console.log('done')
    callback(null, collection.entries)
  }

  collection.onError = function (err) {
    callback(err)
  }

  collection.load(pathToCollectionFile)
}
