const unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

/**
 * 将文件大小转换为字符串
 * @param size 文件大小
 * @returns 文件大小字符串
 */
export function sizeToString(size) {
  let index = 0
  while (size > 1024 && index < unit.length) {
    size /= 1024
    index++
  }
  return size.toFixed(1) + unit[index]
}

/**
 * 将文件大小字符串转换为数字
 * @param string 文件大小字符串
 * @returns 文件大小
 */
export function stringToSize(string) {
  const size = parseFloat(string)
  const unitIndex = unit.findIndex((item) => string.includes(item))
  return size * Math.pow(1024, unitIndex)
}
