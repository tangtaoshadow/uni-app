const {
  getPlatformFilterTag,
  normalizeNodeModules,
  jsPreprocessOptions
} = require('@dcloudio/uni-cli-shared/lib/platform')

const preprocessor = require('@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/preprocess')

const FILTER_TAG = getPlatformFilterTag()

function preprocessBlock(block) {
  if (block.content) {
    block.content = preprocessor.preprocess(block.content, jsPreprocessOptions.context, {
      type: jsPreprocessOptions.type
    }).trim()
  }
  return block
}

module.exports = function parseCustomBlocks(descriptor, options) {

  if (!descriptor.template || !FILTER_TAG || options.isAppNVue) {
    // delete customBlocks
    descriptor.customBlocks.length = 0
    return descriptor
  }

  const modules = Object.create(null)

  descriptor.customBlocks = descriptor.customBlocks.filter(block => {
    if (
      block.attrs.module &&
      (
        block.type === FILTER_TAG ||
        block.attrs.lang === FILTER_TAG
      )
    ) {
      modules[block.attrs.module] = preprocessBlock(block)
      return true
    }
    if ( // renderjs
      block.attrs.module &&
      (
        block.type === 'renderjs' ||
        block.attrs.lang === 'renderjs'
      )
    ) {
      descriptor.renderjs = preprocessBlock(block)
      modules[block.attrs.module] = Object.assign({}, block, {
        content: ''
      })
    }
  })

  if (Object.keys(modules).length) {
    const filterModules = JSON.parse(JSON.stringify(modules))
    Object.keys(filterModules).forEach(name => {
      const filterModule = filterModules[name]
      if (filterModule.attrs.src) {
        filterModule.attrs.src = normalizeNodeModules(filterModule.attrs.src)
      }
    })
    descriptor.template.attrs['filter-modules'] = JSON.stringify(filterModules)
  }

  return descriptor
}
