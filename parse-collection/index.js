var fs = require('fs')
var parseXml = require('@rgrove/parse-xml')
var findCollectionFile = require('../find-collection-file')
var toCamelCase = require('to-camel-case')

if (require.main === module) {
  var filepath = process.argv[2]

  if (filepath) {
    main(filepath, out)
  } else {
    main(out)
  }
} else {
  module.exports = main
}

function out (obj) {
  process.stdout.write(JSON.stringify(obj, null, 2))
}

function main (filepath, cb) {
  var pathToCollectionFile

  if (typeof filepath === 'function') {
    cb = filepath
  } else {
    pathToCollectionFile = filepath
  }

  if (!pathToCollectionFile) {
    findCollectionFile(function (err, filepath) {
      if (err) return cb(err)
      readFile(filepath)
    })
  } else {
    readFile(null, pathToCollectionFile)
  }

  function readFile (filepath) {
    fs.readFile(filepath, 'utf-8', function (err, xml) {
      if (err) return cb(err)

      parseCollection(xml, cb)
    })
  }
}

function parseCollection (xml, cb) {
  var obj = parseXml(xml)
  var nml = obj.children[0].toJSON()

  if (nml.name.toLowerCase() !== 'nml') throw new Error('Invalid file')

  var collection = nml.children.find(node => node.name && node.name.toLowerCase() === 'collection')
  var filtered = collection.children.filter(validNode)

  var map = {}

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

    map[audioId] = track
    delete track.attributes.audioId
  })

  cb(map)
}

function validNode (node) {
  return node.text !== '\n' &&
    node.attributes &&
    node.attributes.AUDIO_ID &&
    node.ARTIST !== 'Native Instruments' &&
    node.ARTIST !== 'Loopmasters'
}
