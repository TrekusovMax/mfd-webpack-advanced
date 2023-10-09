const config = ({} = require('./config'))
const { resolve } = require('path')
const fs = require('fs-extra')
const cheerio = require('cheerio')
const { log } = require('console')

class Bundler {
  constructor(config) {
    this.config = config

    this.inputDir = config.inputDir || 'src'
    this.outputDir = config.outputDir || 'dist'
    this.entryFile = config.entryFile || 'index.js'
    this.stylesFile = config.stylesFile || 'style.css'
    this.indexFile = config.indexFile || 'index.html'
  }

  async bundle() {
    try {
      console.log('Bundling...')

      const entryPath = resolve(this.inputDir, this.entryFile)
      const stylePath = resolve(this.inputDir, this.stylesFile)
      const indexPath = resolve('public', this.indexFile)
      const bundleIndexPath = resolve(this.outputDir, this.indexFile)
      const bundlePath = resolve(this.outputDir, 'bundle.js')
      const bundleStylePath = resolve(this.outputDir, 'bundle.css')

      const entryCode = await fs.readFile(entryPath, 'utf-8')
      const styleCode = await fs.readFile(stylePath, 'utf-8')
      const indexCode = await fs.readFile(indexPath, 'utf-8')

      const bundledCode = `
      <style>${styleCode}</style>
      <script>${entryCode}</script>
      `
      const $ = cheerio.load(indexCode)
      $('body').append(bundledCode)

      await fs.writeFile(bundleIndexPath, $.html())
      await fs.writeFile(bundlePath, entryCode)
      await fs.writeFile(bundleStylePath, styleCode)
    } catch (e) {
      console.error('ERROR!', e)
    }
  }
}

const bundler = new Bundler(config)
bundler.bundle()
