middleware.Collection = require('./Collection')
middleware.findCollectionFile = require('./find-collection-file')
middleware.parseColleciton = require('./parse-collection')

module.exports = middleware

function middleware (vibd, options, next) {
  if (options.type !== 'traktor') return next()

  var { Item } = vibd
  var collection = middleware.Collection()

  collection.load(options.filepath, addFiles)

  function addFiles (err) {
    if (err) return console.error(err)

    collection.entries.forEach(addEntry)
  }

  function addEntry (entry) {
    var item = Item.from(entry.location)

    vibd._add(item, function onAdd (err, itemId) {
      if (err) return console.error(err)
      // added itemId
    })
  }
}
