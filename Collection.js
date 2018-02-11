var xml = require('bel')
var fs = require('fs')
var path = require('path')
var parseXml = require('@rgrove/parse-xml')
var noop = function () {}

var findCollectionFile = require('./find-collection-file')

module.exports = Collection

function Collection () {
  if (!(this instanceof Collection)) return new Collection()

  this.entries = []
  this._xml = fs.readFileSync(path.join(__dirname, 'collection.nml'), 'utf-8')
}

Collection.prototype.onLoad = noop
Collection.prototype.onError = noop

Collection.prototype.toXML = function () {
  // take this.xml and rewrite entries from this.entries

  return xml`
    <?xml version="1.0" encoding="UTF-8" standalone="no" ?>
    <NML VERSION="19">
      <HEAD COMPANY="www.native-instruments.com" PROGRAM="Traktor"></HEAD>
      <MUSICFOLDERS></MUSICFOLDERS>
      <COLLECTION ENTRIES="${this.entries.length}"">
        ${this.entries.map((entry, i) => {
          var attrs = {}
          Object.keys(entry.attributes).forEach(key => {
            attrs[key] = entry.attributes[key]
          })

          return xml`
            <ENTRY ${attrs}}>
              ${Object.keys(entry.children).map(name => {
                var attributes = entry.children[name]
                var attrs = {}
                Object.keys(attributes).forEach(key => {
                  attrs[key] = attributes[key]
                })

                return xml`<${name} ${attrs}></${name}>`
              })}
            </ENTRY>`
        })}
      </COLLECTION>
      <SETS></SETS>
      <PLAYLISTS></PLAYLISTS>
    </NML>`.toString()
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

  this.entries = filtered.map(entry => Entry(entry))

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

function Entry (entry) {
  if (!(this instanceof Entry)) return new Entry(entry)

  this.attributes = entry.attributes
  this.children = entry.children
    .filter(node => node.type === 'element')
    .map(node => node.toJSON())
    .reduce((children, node) => {
      children[node.name] = node.attributes

      return children
    }, {})
}

Entry.prototype.location = function () {
  var dir = this.children['LOCATION']['DIR'].replace(/\/:/g, '/')
  var filename = this.children['LOCATION']['FILE']

  return path.join(dir, filename)
}
