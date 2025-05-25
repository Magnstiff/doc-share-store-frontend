<script>
import {
  HomeOutlined,
  DownloadOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  CloudSyncOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import FileName from '../components/FilesView/FileName.vue'
import show from '../components/notification.js'
import dayjs from 'dayjs'

export default {
  name: 'FilesView',
  components: {
    HomeOutlined,
    FileName,
    DownloadOutlined,
    EyeOutlined,
    LockOutlined,
    UnlockOutlined,
    CloudSyncOutlined,
    DeleteOutlined,
  },
  inject: ['$axios'],
  data() {
    return {
      column: [
        {
          title: '文件名',
          dataIndex: 'fileName',
          key: 'fileName',
        },
        {
          title: '文件大小',
          dataIndex: 'fileSize',
          key: 'fileSize',
          width: '20%',
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: '20%',
        },
      ],
      tableLoading: false,
      curFileName: '',
      selectedRowKeys: [],
      filesData: [],
      currentPath: '/',
      searchValue: '',
      // modal
      inputPasswordOpen: false,
      password: '',
      modalCallback: null,
      // backup modal
      backupModalOpen: false,
      backupModalCallback: null,
      backupList: [],
      clickedFileName: '',
    }
  },
  methods: {
    // 选择文件
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 单击和双击事件
    singleClick(val) {
      this.curFileName = val.name
    },
    doubleClick(val) {
      if (val.isFolder) {
        this.currentPath = this.currentPath + val.fileName + '/'
        this.getFileList()
        return
      }
      this.previewFile(val.fileName)
    },
    // 获取文件列表
    async getFileList() {
      this.tableLoading = true
      this.selectedRowKeys = []
      await this.$axios
        .get(`/file?filePath=${this.currentPath}`)
        .then((res) => {
          // 按照文件夹在上，文件在下的顺序排列，然后按照文件名排序
          res.data.sort((a, b) => {
            if (a.isFolder === b.isFolder) {
              return a.fileName.localeCompare(b.fileName)
            }
            return a.isFolder ? -1 : 1
          })
          this.filesData = res.data
        })
        .catch(() => {
          show('error', '获取文件列表失败，错误信息：' + err)
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    // 返回上一级
    goBack() {
      let currentPath = this.currentPath.substring(0, this.currentPath.length - 1)
      currentPath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1)
      this.currentPath = currentPath
      this.getFileList()
    },
    // 跳转到指定路径
    goToTargetPath(index) {
      if (index === -1) {
        this.currentPath = '/'
        return
      }
      let currentPath = '/'
      for (let i = 0; i <= index; i++) {
        currentPath = currentPath + this.currentPathList[i] + '/'
      }
      this.currentPath = currentPath
      this.getFileList()
    },
    // 预览文件
    previewFile(fileName) {
      const hasEncrypt = this.filesData.find((file) => file.fileName === fileName).encrypt
      if (hasEncrypt) {
        show('error', '加密文件无法预览，请解密后再操作')
        return
      }
      this.$router.push({
        name: 'preview',
        query: {
          previewPath: `${this.currentPath}${fileName}`,
        },
      })
    },
    // 下载文件
    downloadFile(target) {
      const hasEncrypt = target.some(
        (item) => this.filesData.find((file) => file.fileName === item).encrypt,
      )
      if (hasEncrypt) {
        show('error', '加密文件无法下载，请解密后再操作')
        return
      }
      const paths = target.map((item) => this.filesData.find((file) => file.fileName === item))
      this.$store.dispatch('downloadFile', { paths: paths, basePath: this.currentPath })
      this.$router.push('/download')
    },
    delFile(target) {
      this.$axios
        .get(`/deleteFile?filePath=${this.currentPath + target}`)
        .then((res) => {
          show('删除信息', res.data)
          this.getFileList()
        })
        .catch(() => {
          show('error', '删除文件失败，错误信息：' + err)
        })
    },
    // 上传文件
    uploadFile(event) {
      this.$store.dispatch('uploadFile', this.currentPath).then((name) => {
        this.getFileList()
        this.$router.push('/download')
      })
    },
    // 搜索文件
    onSearch() {
      if (this.searchValue === '') {
        this.getFileList()
        return
      }
      this.selectedRowKeys = []
      this.currentPath = '/'
      this.tableLoading = true
      this.$axios
        .get('/search?name=' + this.searchValue)
        .then((res) => {
          // 按照文件夹在上，文件在下的顺序排列，然后按照文件名排序
          res.data.sort((a, b) => {
            if (a.isFolder === b.isFolder) {
              return a.fileName.localeCompare(b.fileName)
            }
            return a.isFolder ? -1 : 1
          })
          this.filesData = res.data
        })
        .catch(() => {
          show('error', '搜索文件失败，错误信息：' + err)
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    // 加密文件
    encryptFile(target) {
      this.inputPasswordOpen = true
      this.modalCallback = () => {
        this.$axios
          .get(`/encrypt?filePath=${this.currentPath + target}&password=${this.password}`)
          .then((res) => {
            show('加密信息', res.data)
            this.getFileList()
          })
          .catch(() => {
            show('error', '加密失败，错误信息：' + err)
          })
        this.inputPasswordOpen = false
        this.password = ''
      }
    },
    // 备份
    fileBackup(target) {
      this.backupModalOpen = true
      this.clickedFileName = target
      // 获取备份列表
      this.$axios
        .get(`/getBackupList?filePath=${this.currentPath + target}`)
        .then((res) => {
          this.backupList = res.data
        })
        .catch(() => {
          show('error', '获取备份列表失败，错误信息：' + err)
        })

      this.backupModalCallback = () => {
        this.$axios
          .get(`/createBackup?filePath=${this.currentPath + target}`)
          .then((res) => {
            show('备份信息', res.data)
            this.getFileList()
          })
          .catch(() => {
            show('error', '备份失败，错误信息：' + err)
          })
        this.backupModalOpen = false
      }
    },
    backup(target) {
      this.$axios
        .get(`/backupFile?filePath=${this.currentPath + this.clickedFileName}&backupUUID=${target}`)
        .then((res) => {
          show('备份信息', res.data)
          this.getFileList()
        })
        .catch(() => {
          show('error', '备份失败，错误信息：' + err)
        })
      this.backupModalOpen = false
    },
    delBackup(target) {
      this.$axios
        .get(
          `/deleteBackup?filePath=${this.currentPath + this.clickedFileName}&backupUUID=${target}`,
        )
        .then((res) => {
          show('备份信息', res.data)
          this.getFileList()
        })
        .catch(() => {
          show('error', '删除备份失败，错误信息：' + err)
        })
      this.backupModalOpen = false
    },
    dayjsFormat(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  mounted() {
    this.getFileList()
  },
  computed: {
    currentPathList() {
      return this.currentPath.split('/').filter((item) => item !== '')
    },
  },
}
</script>

<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240); background-color: #eee"
    title="文件库"
  />
  <a-row class="main">
    <a-row class="main-opera">
      <a-button
        type="primary"
        class="opera-button"
        :disabled="selectedRowKeys.length === 0"
        @click="downloadFile(selectedRowKeys)"
      >
        下载
      </a-button>
      <a-button type="default" class="opera-button" @click="uploadFile">上传</a-button>
      <a-button type="default" class="opera-button" @click="getFileList">刷新</a-button>
      <a-input-search
        v-model:value="searchValue"
        placeholder="搜索文件"
        enter-button="给我搜"
        size="large"
        @search="onSearch"
        style="width: 300px"
        class="opera-button"
      />
    </a-row>
    <a-row class="main-bread">
      <a-button type="link" v-if="currentPath !== '/'" @click="goBack">返回上一级</a-button>
      <span> | 当前路径：</span>
      <a-breadcrumb>
        <a-breadcrumb-item>
          <a @click="goToTargetPath(-1)">
            <HomeOutlined style="margin-right: 5px" />
            首页
          </a>
        </a-breadcrumb-item>
        <a-breadcrumb-item v-for="(key, index) in currentPathList" :key="index">
          <a @click="goToTargetPath(index)">{{ key }}</a>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </a-row>
    <a-row class="main-table">
      <a-table
        :data-source="filesData"
        :columns="column"
        style="width: 100%"
        class="table"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :row-key="(record) => record.fileName"
        :custom-row="
          (data) => ({
            onDblclick: () => doubleClick(data),
            onClick: () => singleClick(data),
          })
        "
        :row-class-name="(_record) => (curFileName === _record.fileName ? 'selected' : null)"
        :loading="tableLoading"
      >
        <template #bodyCell="{ record, column }">
          <FileName
            v-if="column.title === '文件名'"
            :file-name="record.fileName"
            :is-folder="record.isFolder"
          />
          <span v-else-if="column.title === '文件大小'">{{ record.fileSize }}</span>
          <template v-else-if="column.title === '操作'">
            <UnlockOutlined
              class="opera-icons"
              title="未加密"
              v-if="!record.encrypt && !record.isFolder"
              style="color: green"
              @click.prevent="encryptFile(record.fileName)"
            />
            <LockOutlined
              class="opera-icons"
              title="解密"
              v-if="record.encrypt && !record.isFolder"
              style="color: red"
              @click.prevent="encryptFile(record.fileName)"
            />
            <DownloadOutlined
              class="opera-icons"
              title="下载"
              @click.prevent="downloadFile([record.fileName])"
            />
            <EyeOutlined
              class="opera-icons"
              title="预览"
              @click.prevent="previewFile(record.fileName)"
              v-if="!record.isFolder"
            />
            <DeleteOutlined
              class="opera-icons"
              title="删除"
              @click.prevent="delFile(record.fileName)"
            />
            <CloudSyncOutlined
              class="opera-icons"
              title="备份"
              @click.prevent="fileBackup(record.fileName)"
              v-if="!record.isFolder"
            />
          </template>
        </template>
      </a-table>
    </a-row>
  </a-row>
  <a-modal v-model:open="inputPasswordOpen" title="输入密码" @ok="modalCallback">
    <a-input v-model:value="password" placeholder="请输入密码" />
  </a-modal>
  <a-modal
    v-model:open="backupModalOpen"
    title="备份信息"
    @ok="backupModalCallback"
    ok-text="新增备份"
  >
    <a-list item-layout="horizontal" :data-source="backupList">
      <template #renderItem="{ item }">
        <a-list-item>
          <template #actions>
            <a key="list-loadmore-edit" @click="backup(item.backup_path)">恢复</a>
            <a key="list-loadmore-dele" @click="delBackup(item.backup_path)">删除</a>
          </template>
          <a-list-item-meta :description="'UUID:' + item.backup_path">
            <template #title> {{ '备份时间:' + dayjsFormat(item.time) }} </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </a-modal>
</template>

<style scoped>
.main {
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.main-opera {
  display: flex;
  align-items: center;
  height: 65px;
}

.opera-button {
  margin-left: 20px;
  width: 90px;
  height: 40px;
}

.main-bread {
  margin: 0 auto 15px 20px;
  height: 40px;
  display: flex;
  align-items: center;
}

.main-table {
  width: 100%;
}

.table :deep(.selected) td {
  background-color: #fafafa;
}

.opera-icons {
  margin-right: 10px;
  border-radius: 50%;
  padding: 6px;
  cursor: pointer;
}

.opera-icons:hover {
  background-color: #bbb;
  transition: 0.5s;
}
</style>
