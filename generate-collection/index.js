var Collection = require('../Collection')

if (require.main === module) {
  generate(console.log)
} else {
  module.exports = generate
}

function generate (callback) {
  var collection = Collection()

  collection.load()
  collection.on('load', () => callback(collection.toXML()))
}
