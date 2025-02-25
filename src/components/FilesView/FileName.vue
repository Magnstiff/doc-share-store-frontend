<script>
import {
  FolderOutlined, SoundOutlined, FileExcelOutlined, FileWordOutlined, FilePptOutlined, FileTextOutlined, FilePdfOutlined, FileZipOutlined, FileImageOutlined, FileGifOutlined, AndroidOutlined, WindowsOutlined, VideoCameraOutlined, FileUnknownOutlined
} from '@ant-design/icons-vue'

export default {
  name: 'FileName',
  components: { FolderOutlined, SoundOutlined, FileExcelOutlined, FileWordOutlined, FilePptOutlined, FileTextOutlined, FilePdfOutlined, FileZipOutlined, FileImageOutlined, FileGifOutlined, AndroidOutlined, WindowsOutlined, VideoCameraOutlined, FileUnknownOutlined },
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
    fileType () {
      return this.isFolder ? 'folder' : this.fileName.substring(this.fileName.lastIndexOf('.') + 1, this.fileName.length).toLowerCase()
    }
  }
}
</script>

<template>
  <div>
    <span class="svg">
      <FolderOutlined v-if="fileType === 'folder'"/>
      <SoundOutlined v-else-if="fileType === 'mp3' || fileType === 'wma' || fileType === 'wav' || fileType === 'ape' || fileType === 'flac' || fileType === 'ogg' || fileType === 'acc'"/>
      <FileExcelOutlined v-else-if="fileType === 'xls' || fileType === 'xlsx'"/>
      <FileWordOutlined v-else-if="fileType === 'doc' || fileType === 'docx'"/>
      <FilePptOutlined v-else-if="fileType === 'ppt' || fileType === 'pptx'"/>
      <FilePdfOutlined v-else-if="fileType === 'pdf'"/>
      <FileTextOutlined v-else-if="fileType === 'txt'"/>
      <FileZipOutlined v-else-if="fileType === 'zip' || fileType === '7z' || fileType === 'rar' || fileType === 'wim'"/>
      <FileImageOutlined v-else-if="fileType === 'bmp' || fileType === 'jpeg' || fileType === 'png' || fileType === 'svg' || fileType === 'psd' || fileType === 'jpg'"/>
      <FileGifOutlined v-else-if="fileType === 'gif'"/>
      <WindowsOutlined v-else-if="fileType === 'exe'"/>
      <AndroidOutlined v-else-if="fileType === 'apk'"/>
      <VideoCameraOutlined v-else-if="fileType === 'mp4' || fileType === 'avi' || fileType === 'dat' || fileType === 'flv' || fileType === 'm4v' || fileType === 'wmv' || fileType === 'asf' || fileType === 'mkv' || fileType === 'mpeg'"/>
      <FileUnknownOutlined v-else/>
    </span>
    <span>{{fileName}}</span>
  </div>
</template>

<style scoped>
.svg {
  margin-right: 7px;
}
</style>
