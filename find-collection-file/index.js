// find a collection.nml file

var fs = require('fs')
var os = require('os')
var glob = require('glob')

if (require.main === module) {
  find(console.log)
} else {
  module.exports = find
}

function find (cb) {
  var docsDir = {
    'darwin': 'Documents',
    'win32': 'My Documents'
  }[os.platform()]

  if (!docsDir) throw new Error('This OS is not supported by Traktor')

  glob(`${os.homedir()}/${docsDir}/Native*/Traktor*`, function (err, matches) {
    if (err || !matches.length) return cb(err, null)

    var nmlPath = matches[0] + '/collection.nml'
    if (!fs.existsSync(nmlPath)) return cb()

    return cb(null, nmlPath)
  })
}
