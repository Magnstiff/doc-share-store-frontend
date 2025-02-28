import { createStore } from 'vuex'
import axios from '@/axios/index.js'
import { stringToSize } from '../common/index.js'
import { saveAs } from 'file-saver'
import show from '@/components/notification.js'
import JSZip from 'jszip'
import { v4 } from 'uuid'

export default createStore({
  state() {
    return {
      taskList: [],
    }
  },
  actions: {
    /**
     * 初始化任务
     * @param {*} param0
     * @param {*} param1 {name, size} 任务信息
     * @returns Promise
     */
    async initTask({ state }, { name, size }) {
      const id = v4()
      state.taskList.push({
        name: name,
        size: size,
        finish: 0,
        id,
      })
      return id
    },

    /**
     * 更新任务
     * @param {*} param0
     * @param {*} param1 {id, finish} 任务信息
     */
    async updateTask({ state }, { id, finish }) {
      id = await id
      const task = state.taskList.find((task) => task.id === id)
      const newTask = JSON.parse(JSON.stringify(task))
      newTask.finish = await finish
      state.taskList.splice(state.taskList.indexOf(task), 1, newTask)
    },

    /**
     * 上传文件
     * @param {*} state
     * @param {*} basePath 上传文件路径
     * @returns Promise
     */
    async uploadFile({ state }, basePath) {
      return new Promise((resolve, reject) => {
        const dom = document.createElement('input')
        dom.type = 'file'
        dom.click()
        dom.onchange = async (event) => {
          if (!event.target.files.length) return
          const file = event.target.files[0]
          // 发送任务
          const taskID = this.dispatch('initTask', { name: file.name, size: file.size })
          // 分片上传
          const chunkSize = 1024 * 1024 * 500
          const chunks = Math.ceil(file.size / chunkSize)
          for (let i = 0; i < chunks; i++) {
            const start = i * chunkSize
            const end = Math.min(file.size, start + chunkSize)
            const form = new FormData()
            form.append('file', file.slice(start, end))
            form.append('chunks', chunks)
            form.append('chunk', i)
            await axios
              .post('/upload', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
                params: { path: basePath + file.name },
                onUploadProgress: (progressEvent) => {
                  const finish = start + progressEvent.loaded
                  this.dispatch('updateTask', { id: taskID, finish: finish })
                },
              })
              .then(() => show('上传成功', file.name + '上传成功'))
              .catch((err) => show('错误', `上传 ${file.name} 时出错，错误信息：${err}`))
          }
          dom.remove()
          resolve(file.name)
        }
      })
    },
    /**
     * 下载文件
     * @param {*} state
     * @param {*} paths 下载文件信息
     * @returns
     */
    async downloadFile({ state }, { paths, basePath }) {
      function downloadSingle(filePath, onDownloadProgress) {
        return new Promise((resolve, reject) => {
          axios({
            url: '/download?filePath=' + filePath,
            method: 'get',
            responseType: 'blob',
            onDownloadProgress: onDownloadProgress,
          })
            .then((res) => resolve(res.data))
            .catch((err) => show('错误', `下载 ${filePath} 时出错，错误信息：${err}`))
        })
      }

      const queue = []
      while (paths.length) {
        const path = paths.shift()
        if (path.isFolder) {
          const res = (await axios.get(`/file?filePath=${path.filePath}`)).data
          paths.push(...res)
        } else {
          queue.push(path)
        }
      }
      // 单文件下载
      if (queue.length == 1) {
        const file = queue[0]
        // 初始化任务
        const taskID = this.dispatch('initTask', {
          name: file.fileName,
          size: stringToSize(file.fileSize),
        })
        // 下载文件
        const blob = new Blob(
          [
            await downloadSingle(file.filePath, (progressEvent) => {
              this.dispatch('updateTask', { id: taskID, finish: progressEvent.loaded })
            }),
          ],
          { type: 'application/octet-stream' },
        )
        saveAs(blob, file.fileName)
        show('提示', `${file.fileName} 下载完成`)
        return
      }
      // 多文件下载
      const zip = new JSZip()
      // 统计所有文件大小
      let totalSize = 0
      for (const file of queue) totalSize += stringToSize(file.fileSize)
      // 初始化任务
      const taskID = this.dispatch('initTask', { name: '文件压缩包.zip', size: totalSize })
      let finish = 0
      for (const file of queue) {
        const blob = new Blob([
          await downloadSingle(file.filePath, (progressEvent) => {}),
          {
            type: 'application/octet-stream',
          },
        ])
        zip.file(file.filePath.slice(basePath.length), blob)
        finish += stringToSize(file.fileSize)
        this.dispatch('updateTask', { id: taskID, finish })
      }
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, '文件包.zip')
      show('提示', `文件包共${queue.length}个文件 下载完成`)
    },
  },
})
