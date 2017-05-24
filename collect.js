const registry = require('package-stream')()
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const ora = require('ora')
const spinner = ora().start()
let count = 0

registry
  .on('package', function (pkg) {
    spinner.text = String(++count)
    if (
      pkg && 
      pkg.name && 
      pkg.description && 
      (pkg.name.match(/github/i) || pkg.description.match(/github/i)) &&
      (pkg.description.match(/api/i) || pkg.description.match(/client/i)) &&
      !pkg.description.match('github.com') && 
      !pkg.name.match('@')
    ) {
      const file = path.join(__dirname, `packages/${pkg.name}.json`)
      mkdirp(path.dirname(file))
      fs.writeFileSync(file, JSON.stringify(pkg))
      console.log()
      console.log([pkg.name, pkg.description].join(' - '))
    }
  })
  .on('up-to-date', function () {
    process.exit()
  })
