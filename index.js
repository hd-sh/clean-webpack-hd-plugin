'use strict'
const fs = require('fs')
const path = require('path')
function removeDir(outputPath, exclude) {
  // 文件夹路径存在
  if (fs.existsSync(outputPath)) {
    fs.readdirSync(outputPath).forEach(function (file) {
      const curPath = path.join(outputPath, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        removeDir(curPath, exclude)
      } else {
        if (!exclude.includes(file)) {
          fs.unlinkSync(curPath)
        }
      }
    })
    if (!fs.readdirSync(outputPath).length) {
      fs.rmdirSync(outputPath)
    }
  }
}
class CleanWebpackHdPlugin {
  constructor(options) {
    this.options = {
      exclude: [],
      ...options,
    }
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('CleanWebpackHdPlugin', (compilation, callback) => {
      const outputOpts = compilation.options.output
      removeDir(outputOpts.path, this.options.exclude)
      callback()
    })
  }
}

module.exports = CleanWebpackHdPlugin
