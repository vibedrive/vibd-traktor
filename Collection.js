var fs = require('fs')
var os = require('os')
var path = require('path')
var et = require('elementtree')
var pd = require('pretty-data').pd

var findCollectionFile = require('./find-collection-file')

module.exports = Collection

function Collection () {
  if (!(this instanceof Collection)) return new Collection()

  this._tree = null

  Object.defineProperty(this, 'entries', {
    get: this._getEntries
  })
}

Collection.prototype.toXML = function () {
  return pd.xml(this._tree.write())
}

Collection.prototype.load = function (pathToCollectionFile, callback) {
  if (!pathToCollectionFile) {
    return findCollectionFile((err, filepath) => {
      if (err) return this.onError(err)

      this._load(filepath, callback)
    })
  }

  this._load(pathToCollectionFile, callback)
}

Collection.prototype._load = function (filepath, callback) {
  fs.readFile(filepath, 'utf-8', (err, xml) => {
    if (err) return callback(err)

    this._xml = xml
    this._tree = et.parse(this._xml)
    callback()
  })
}

Collection.prototype._getEntries = function () {
  var collectionEl = this._tree.findall('COLLECTION')[0]
  var entryElements = collectionEl.findall('ENTRY')
  var entries = entryElements.map(Entry)

  return entries
}

function Entry (node) {
  if (!(this instanceof Entry)) return new Entry(node)

  this._node = node
  this._location = null

  Object.defineProperty(this, 'location', {
    get: () => {
      return this._location || this._getLocation()
    }
  })
}

Entry.prototype._getLocation = function () {
  var location = this._node.getchildren().find(node => node.tag === 'LOCATION')
  var volume = location.get('VOLUME')
  var dir = location.get('DIR').replace(/\/:/g, '/')
  var filename = location.get('FILE')

  if (os.platform() !== 'win32') { volume = '' }

  this._location = path.join(volume, dir, filename)

  return this._location
}
