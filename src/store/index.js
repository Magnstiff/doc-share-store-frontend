import { createStore } from 'vuex'
import axios from '@/axios/index.js'
import { stringToSize } from '../common/index.js'
import { saveAs } from 'file-saver'
import show from '@/components/notification.js'
import JSZip, { file } from 'jszip'

export default createStore({
  state() {
    return {
      taskList: [],
    }
  },
  mutations: {
    /**
     * 下载文集
     * @param {*} state
     * @param {*} paths 下载文件信息
     * @returns
     */
    async downloadFile(state, paths, basePath) {
      const queue = paths
      while (paths.length) {
        const path = paths.shift()
        if (path.isFolder) {
          const res = (await axios.get(`/file?filePath=${path.filePath}`)).data
          paths.push(res)
        } else {
          queue.push(path)
        }
      }
      // download single file
      async function downloadSingle(filePath, task) {
        await axios({
          url: '/download',
          method: 'post',
          data: { filePath },
          responseType: 'blob',
          signal: task.axiosController.signal,
          onDownloadProgress: (progressEvent) => {
            // currentDownloadInfo.fileSize = parseMemorySize(progressEvent.total)
            // currentDownloadInfo.downloadPercent = Number(
            //   ((progressEvent.loaded / progressEvent.total) * 100).toFixed(0),
            // )
            // currentDownloadInfo.downloadedSize = parseMemorySize(progressEvent.loaded)
            // currentDownloadInfo.downloadSpeed = parseMemorySize(progressEvent.rate) + '/s'
          },
        })
          .then((res) => {
            return res.data
            // blobList.push(res.data)
            // if (info.files.length > 1 && blobList.length < info.files.length) {
            //   currentDownloadInfo.fileName = `(文件包 ${blobList.length + 1}/${info.files.length}): ${info.files[blobList.length]}`
            // }
          })
          .catch((err) => {
            if (err.message === 'canceled') {
              task.status = 'canceled'
            } else {
              currentDownloadInfo.status = 'error'
              show('错误', `下载 ${file} 时出错`)
              currentDownloadInfo.status = 'error'
            }
          })
      }

      // 单文件下载
      if (queue.length == 1) {
        const file = queue[0]
        const task = {
          fileName: file.fileName,
          fileSize: file.fileSize,
          downloadedSize: '0B',
          downloadSpeed: '0B/s',
          downloadPercent: 0,
          axiosController: new AbortController(),
          status: 'downloading',
        }
        state.taskList.push(task)
        const blob = new Blob(await downloadSingle(file.filePath, task))
        saveAs(blob, file.fileName)
        show('提示', `${file.fileName} 下载完成`)
      }

      // await solveDownloadList(info).then((res) => {
      //   info = res
      // })

      // const fileName =
      //   (info.files.length > 1 ? `(文件包 1/${info.files.length}): ` : '') + info.files[0]
      // show(
      //   '提示',
      //   `${info.files.length > 1 ? `文件包共${info.files.length}个文件` : `${info.files[0]}`} 开始下载`,
      // )

      // const blobList = []
      // const currentDownloadInfo =
      //   state.downloadInfo.downloadList[state.downloadInfo.downloadList.length - 1]
      // for (const file of info.files) {

      // }
      // if (currentDownloadInfo.status !== 'downloading') return
      // currentDownloadInfo.fileName = `${info.files.length}个文件压缩中`
      // if (info.files.length === 1) {
      //   const blob = new Blob(blobList)
      //   saveAs(blob, info.files[0])
      //   show('提示', `${info.files[0]} 下载完成`)
      // } else {
      //   const zip = new JSZip()
      //   blobList.forEach((blob, index) => {
      //     zip.file(info.files[index], blob)
      //   })
      //   zip.generateAsync({ type: 'blob' }).then((content) => {
      //     saveAs(content, '文件包.zip')
      //     currentDownloadInfo.fileName = `${info.files.length}个文件下载完成`
      //     show('提示', `文件包共${info.files.length}个文件 下载完成`)
      //   })
      // }
      // currentDownloadInfo.status = 'finished'
      // currentDownloadInfo.downloadSpeed = '0B/s'
    },
    cancelDownload(state, index) {
      const currentDownloadInfo = state.downloadInfo.downloadList[index]
      currentDownloadInfo.axiosController.abort()
      currentDownloadInfo.status = 'canceled'
    },
    uploadFile(state, basePath) {
      const dom = document.createElement('input')
      dom.type = 'file'
      dom.click()
      dom.onchange = async (event) => {
        // 分片上传
        if (!event.target.files.length) return
        const file = event.target.files[0]
        const chunkSize = 1024 * 1024
        const chunks = Math.ceil(file.size / chunkSize)
        for (let i = 0; i < chunks; i++) {
          const start = i * chunkSize
          const end = Math.min(file.size, start + chunkSize)
          const form = new FormData()
          form.append('file', file.slice(start, end))
          form.append('path', basePath + file.name)
          form.append('chunks', chunks)
          form.append('chunk', i)
          await axios
            .post('/upload', form, {
              headers: { 'Content-Type': 'multipart/form-data' },
              onUploadProgress: (progressEvent) => {
                // this.uploadProgress = `${((i + 1) / chunks) * 100}%`
              },
            })
            .catch((error) => {
              // alert(error?.response.data)
              // this.uploading = false
            })
        }
        // this.uploading = false
        // this.uploadProgress = ''
        // this.getFileList(this.currentPath)
        dom.remove()
      }
    },
  },
})
