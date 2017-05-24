const requireDir = require('require-dir')
const path = require('path')
const fs = require('fs')
const blacklist = fs.readFileSync(path.join(__dirname, 'blacklist.txt'), 'utf8').split('\n')
const counts = require('download-counts')
const pluralize = require('pluralize')
const dedent = require('dedent')
const packages = Object.values(requireDir('./packages'))
  .filter(pkg => !blacklist.includes(pkg.name))
  .map(pkg => Object.assign(pkg, {averageDailyDownloads: counts[pkg.name] || 0}))
  .sort((a, b) => b.averageDailyDownloads - a.averageDailyDownloads)

console.log(dedent`# Pull Request Modules

> a list of ${packages.length} javascript modules for managing pull requests.

## How?

This list is created by:

1. Consuming the entire npm registry using [package-stream](http://ghub.io/package-stream).
1. Plucking out packages with the words "pull request" in their description
1. Sorting results by average daily downloads using [download-counts](http://ghub.io/download-counts).

## The Modules

`)

packages.forEach((pkg, i) => {
  console.log(`${i+1}. [${pkg.name}](http://ghub.io/${pkg.name}) - ${pkg.description} (${pkg.averageDailyDownloads} ${pluralize('download', pkg.averageDailyDownloads)}/day)`)
})
