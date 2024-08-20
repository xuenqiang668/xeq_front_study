const { platform } = require('os')
const VOLUME = /^([A-Z]:)/i
const IS_WINDOWS = platform() === 'win32'

function slash(path) {
  const isExtendedLengthPath = path.startsWith('\\\\?\\')

  if (isExtendedLengthPath) {
    return path
  }

  return path.replace(/\\/g, '/')
}
// 路径归一化
const normalizeId = (id) => {
  if ((IS_WINDOWS && typeof id === 'string') || VOLUME.test(id)) {
    return slash(id.replace(VOLUME, ''))
  }
  return id
}

module.exports = {
  normalizeId,
}
