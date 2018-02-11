var fs = require('fs')
var path = require('path')
var parseXml = require('@rgrove/parse-xml')
var toCamelCase = require('to-camel-case')
var noop = function () {}

var findCollectionFile = require('./find-collection-file')

module.exports = Collection

function Collection () {
  if (!(this instanceof Collection)) return new Collection()

  this.entries = null
  this._xml = fs.readFileSync(path.join(__dirname, 'collection.nml'), 'utf-8')
}

Collection.prototype.onLoad = noop
Collection.prototype.onError = noop

Collection.prototype.toXML = function () {
  // take this.xml and rewrite entries from this.entries
  return this._xml
}

Collection.prototype.load = function (pathToCollectionFile) {
  if (!pathToCollectionFile) {
    return findCollectionFile((err, filepath) => {
      if (err) return this.onError(err)

      this._load(filepath)
    })
  }

  this._load(pathToCollectionFile)
}

Collection.prototype._load = function (filepath) {
  fs.readFile(filepath, 'utf-8', (err, xml) => {
    if (err) return this.onError(err)

    this._xml = xml

    this.parse(xml)
  })
}

Collection.prototype.parse = function () {
  var obj = parseXml(this._xml)
  var nml = obj.children[0].toJSON()
  var collection = nml.children.find(node => node.name === 'COLLECTION')
  var filtered = collection.children.filter(isValidNode)
  var entries = {}

  filtered.forEach(entry => {
    entry = entry.toJSON()
    entry.children.push({
      name: 'attributes',
      attributes: entry.attributes
    })

    var track = {}

    entry.children
      .filter(node => node.name)
      .forEach(node => {
        var attrs = Object.keys(node.attributes)
          .reduce((dict, key) => {
            var nextKey = toCamelCase(key.toLowerCase())
            dict[nextKey] = node.attributes[key]

            return dict
          }, {})

        track[toCamelCase(node.name.toLowerCase())] = attrs
      })

    var audioId = track.attributes.audioId

    entries[audioId] = track
    delete track.attributes.audioId
  })

  this.entries = entries
  this.onLoad()
}

function isValidNode (node) {
  return (
    node.text !== '\n' &&
    node.attributes &&
    node.attributes.AUDIO_ID &&
    node.ARTIST !== 'Native Instruments' &&
    node.ARTIST !== 'Loopmasters'
  )
}
