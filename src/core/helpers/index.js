const components = ['SystemAsyncLoading', 'SystemAsyncError']
export function isPage (vm) {
  if (vm.$parent && vm.$parent.$options.name === 'PageBody') {
    if (components.indexOf(vm.$options.name) !== -1) {
      return false
    }
    return true
  }
  return false
}

export function hasLifecycleHook (vueOptions = {}, hook) {
  return Array.isArray(vueOptions[hook]) && vueOptions[hook].length
}

export function normalizeDataset (dataset = {}) {
  // ios8.x,9.x Object.assign({},dataset) 始终返回 {}
  // http://ask.dcloud.net.cn/question/70246
  const result = JSON.parse(JSON.stringify(dataset))
  if (__PLATFORM__ === 'h5') {
    const keys = Object.keys(result)
    const len = keys.length
    if (len) {
      // remove data-v-
      for (let i = 0; i < len; i++) {
        const key = keys[i]
        const len = key.length
        if (key.substr(0, 1) === 'v' && (len === 9 || len === 10)) {
          delete result[key]
          break
        }
      }
    }
  }
  return result
}

export function upx2px (str) {
  str = str + ''
  if (str.indexOf('upx') !== -1) { // upx转换
    return uni.upx2px(parseInt(str) || 0)
  }
  return parseInt(str) || 0
}
