<script>
import {
  GithubOutlined,
  FolderOutlined,
  SoundOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FilePptOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileZipOutlined,
  FileImageOutlined,
  FileGifOutlined,
  AndroidOutlined,
  WindowsOutlined,
  VideoCameraOutlined,
  FileUnknownOutlined
} from '@ant-design/icons-vue'

export default {
  name: 'FileName',
  components: {
    GithubOutlined,
    FolderOutlined,
    SoundOutlined,
    FileExcelOutlined,
    FileWordOutlined,
    FilePptOutlined,
    FileTextOutlined,
    FilePdfOutlined,
    FileZipOutlined,
    FileImageOutlined,
    FileGifOutlined,
    AndroidOutlined,
    WindowsOutlined,
    VideoCameraOutlined,
    FileUnknownOutlined
  },
  props: {
    fileName: {
      type: String,
      default: ''
    },
    isFolder: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    fileType() {
      if (!this.isFolder) return this.fileName.substring(this.fileName.lastIndexOf('.') + 1, this.fileName.length).toLowerCase()
      if (this.fileName.endsWith('.git')) return 'git'
      return 'folder'
    },
    iconType() {
      for (const [icon, types] of Object.entries(this.typeMap)) {
        if (types.includes(this.fileType)) return icon
      }
      return 'FileUnknownOutlined'
    }
  },
  data() {
    return {
      typeMap: {
        'FolderOutlined': ['folder'],
        'SoundOutlined': ['mp3', 'wma', 'wav', 'ape', 'flac', 'ogg', 'acc'],
        'FileExcelOutlined': ['xls', 'xlsx'],
        'FileWordOutlined': ['doc', 'docx'],
        'FilePptOutlined': ['ppt', 'pptx'],
        'FilePdfOutlined': ['pdf'],
        'FileTextOutlined': ['txt'],
        'FileZipOutlined': ['zip', '7z', 'rar', 'wim'],
        'FileImageOutlined': ['bmp', 'jpeg', 'png', 'svg', 'psd', 'jpg'],
        'FileGifOutlined': ['gif'],
        'WindowsOutlined': ['exe'],
        'AndroidOutlined': ['apk'],
        'VideoCameraOutlined': ['mp4', 'avi', 'dat', 'flv', 'm4v', 'wmv', 'asf', 'mkv', 'mpeg'],
        'GithubOutlined': ['git']
      }
    }
  }
}
</script>

<template>
  <div>
    <span class="svg">
      <component :is="iconType" />
    </span>
    <span>{{ fileName }}</span>
  </div>
</template>

<style scoped>
.svg {
  margin-right: 7px;
}
</style>
