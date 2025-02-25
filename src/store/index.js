import { createStore } from 'vuex'
import axios from '@/axios/index.js'
import { parseMemorySize, solveDownloadList } from '@/public/index.js'
import { saveAs } from 'file-saver'
import show from '@/components/notification.js'
import JSZip from 'jszip'

export default createStore({
  state () {
    return {
      downloadInfo: {
        downloadList: []
      },
      ua: {},
      previewPath: ''
    }
  },
  mutations: {
    setPreviewPath (state, path) {
      state.previewPath = path
    },
    setUA (state, ua) {
      state.ua = ua
    },
    async downloadFile (state, info) {
      await solveDownloadList(info).then(res => {
        info = res
      })

      const fileName = (info.files.length > 1 ? `(文件包 1/${info.files.length}): ` : '') + info.files[0]
      show('提示', `${info.files.length > 1 ? `文件包共${info.files.length}个文件` : `${info.files[0]}`} 开始下载`)
      state.downloadInfo.downloadList.push({
        fileName,
        fileSize: '0B',
        downloadedSize: '0B',
        downloadSpeed: '0B/s',
        downloadPercent: 0,
        axiosController: new AbortController(),
        status: 'downloading'
      })

      const blobList = []
      const currentDownloadInfo = state.downloadInfo.downloadList[state.downloadInfo.downloadList.length - 1]
      for (const file of info.files) {
        await axios({
          url: '/download',
          method: 'post',
          data: {
            filePath: info.filePath + file
          },
          responseType: 'blob',
          signal: currentDownloadInfo.axiosController.signal,
          onDownloadProgress: progressEvent => {
            currentDownloadInfo.fileSize = parseMemorySize(progressEvent.total)
            currentDownloadInfo.downloadPercent = Number((progressEvent.loaded / progressEvent.total * 100).toFixed(0))
            currentDownloadInfo.downloadedSize = parseMemorySize(progressEvent.loaded)
            currentDownloadInfo.downloadSpeed = parseMemorySize(progressEvent.rate) + '/s'
          }
        }).then(res => {
          blobList.push(res.data)
          if (info.files.length > 1 && blobList.length < info.files.length) {
            currentDownloadInfo.fileName = `(文件包 ${blobList.length + 1}/${info.files.length}): ${info.files[blobList.length]}`
          }
        }).catch(err => {
          if (err.message === 'canceled') {
            currentDownloadInfo.status = 'canceled'
          } else {
            currentDownloadInfo.status = 'error'
            show('错误', `下载 ${file} 时出错`)
            currentDownloadInfo.status = 'error'
          }
        })
      }
      if (currentDownloadInfo.status !== 'downloading') return
      currentDownloadInfo.fileName = `${info.files.length}个文件压缩中`
      if (info.files.length === 1) {
        const blob = new Blob(blobList)
        saveAs(blob, info.files[0])
        show('提示', `${info.files[0]} 下载完成`)
      } else {
        const zip = new JSZip()
        blobList.forEach((blob, index) => {
          zip.file(info.files[index], blob)
        })
        zip.generateAsync({ type: 'blob' }).then(content => {
          saveAs(content, '文件包.zip')
          currentDownloadInfo.fileName = `${info.files.length}个文件下载完成`
          show('提示', `文件包共${info.files.length}个文件 下载完成`)
        })
      }
      currentDownloadInfo.status = 'finished'
      currentDownloadInfo.downloadSpeed = '0B/s'
    },
    cancelDownload (state, index) {
      const currentDownloadInfo = state.downloadInfo.downloadList[index]
      currentDownloadInfo.axiosController.abort()
      currentDownloadInfo.status = 'canceled'
    }
  }
})
