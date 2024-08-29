module.exports = class ChangeWebpackPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('ChangeWebpackPlugin', (compilation) => {
      for (const key in compilation.assets) {
        if (key.endsWith('.html')) {
          const val = compilation.assets[key].source()
          const changeClassNameContent = val.replace(
            'testPlugin',
            'testPlugin2'
          )

          console.log(changeClassNameContent)
          compilation.assets[key] = {
            source: () => changeClassNameContent,
            size: () => changeClassNameContent.length,
          }
        }
      }
    })
  }
}
