const requireDir = require('require-dir')
const path = require('path')
const fs = require('fs')
const blacklist = fs.readFileSync(path.join(__dirname, 'blacklist.txt'), 'utf8').split('\n')
const counts = require('download-counts')
const dependentCounts = require('dependent-counts')
const pluralize = require('pluralize')
const dedent = require('dedent')
const packages = Object.values(requireDir('./packages'))
  .filter(pkg => !blacklist.includes(pkg.name))
  .map(pkg => Object.assign(pkg, {averageDailyDownloads: counts[pkg.name] || 0}))
  .map(pkg => Object.assign(pkg, {
    dependentCounts: (dependentCounts.find(dep => dep.name === pkg.name) || {totalDirectDependents: 0})
  }))
  .filter(pkg => pkg.averageDailyDownloads > 0)
  .sort((a, b) => b.averageDailyDownloads - a.averageDailyDownloads)

console.log(dedent`# GitHub API Modules

> a list of ${packages.length} javascript modules for using the GitHub API.

See also 
[pull-request-modules](https://github.com/nice-registry/pull-request-modules)
and
[http-modules](https://github.com/nice-registry/http-modules).

## How?

This list is created by:

1. Consuming the entire npm registry using [package-stream](http://ghub.io/package-stream).
1. Plucking out packages with the word "github" in their name or description and the words "client" or "api" in their description.
1. Sorting results by [average daily downloads](http://ghub.io/download-counts) and [direct dependents](http://ghub.io/dependent-counts) counts.

## Lists

- [Top Modules by Download Count](#top-modules-by-download-count)
- [Top Modules by Dependent Count](#top-modules-by-direct-dependent-count)

## Top Modules by Download Count

`)

packages.forEach((pkg, i) => {
  console.log(`${i+1}. [${pkg.name}](http://ghub.io/${pkg.name}) - ${pkg.description} (${pkg.averageDailyDownloads} ${pluralize('download', pkg.averageDailyDownloads)}/day)`)
})

console.log(`

## Top Modules by Direct Dependent Count

`)

packages
  .sort((a,b) => Number(b.dependentCounts.totalDirectDependents) - Number(a.dependentCounts.totalDirectDependents))
  .forEach((pkg, i) => {
    console.log(`${i+1}. [${pkg.name}](http://ghub.io/${pkg.name}) - ${pkg.description} (${pkg.dependentCounts.totalDirectDependents} ${pluralize('direct dependent', pkg.dependentCounts.totalDirectDependents)})`)
  })

