import axios from '@/axios/index.js'

export function parseMemorySize (size) {
  const list = ['B', 'KB', 'MB', 'GB', 'TB']
  let count = 0
  while (size > 1024) {
    size /= 1024
    count++
  }
  if (isNaN(size)) {
    return '0B'
  }
  return size.toFixed(2) + list[count]
}

export async function solveDownloadList (info) {
  async function solveFolder (folder, base) {
    return new Promise(resolve => {
      const list = []
      axios.get('/file', {
        params: {
          filePath: base + folder
        }
      }).then(async res => {
        for (const file of res.data) {
          if (file.fileName.isFolder) {
            await solveFolder(folder + file.fileName.name + '/', base).then(res => {
              list.push(...res)
            })
          } else {
            list.push(folder + file.fileName.name)
          }
        }
        resolve(list)
      })
    })
  }

  const list = []
  for (const file of info.files) {
    if (file.isFolder) {
      await solveFolder(file.name + '/', info.filePath).then(res => {
        list.push(...res)
      })
    } else {
      list.push(file.name)
    }
  }

  return {
    filePath: info.filePath,
    files: list
  }
}
