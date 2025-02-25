<script>
import PdfViewer from '../components/PreviewView/PdfViewer.vue'
import TxtViewer from '@/components/PreviewView/TxtViewer.vue'
import MusicViewer from '@/components/PreviewView/MusicViewer.vue'
import PictureViewer from '@/components/PreviewView/PictureViewer.vue'
import VideoViewer from '@/components/PreviewView/VideoViewer.vue'
import CompressViewer from '@/components/PreviewView/CompressViewer.vue'

export default {
  name: 'PreviewView',
  components: {
    CompressViewer,
    VideoViewer,
    PictureViewer,
    MusicViewer,
    TxtViewer,
    PdfViewer
  },
  data () {
    return {
      url: '',
      filePath: ''
    }
  },
  beforeMount () {
    this.filePath = this.$route.query.previewPath || this.$store.state.previewPath
    this.$store.commit('setPreviewPath', this.filePath)
    this.$router.push({ query: { previewPath: this.filePath, ...this.$route.query }, replace: true })
    this.url = `/api/preview?filePath=${this.filePath}`
  },
  computed: {
    fileType () {
      if (this.filePath) {
        const arr = this.filePath.split('.')
        return arr[arr.length - 1].toLowerCase()
      }
      return ''
    }
  }
}
</script>

<template>
  <a-page-header style="border: 1px solid rgb(235, 237, 240);background-color:#eee;" title="预览"/>
  <div class="viewer">
    <div class="null" v-if="!filePath">未选择预览文件，请从文件预览页面点击进入</div>
    <PdfViewer v-else-if="fileType === 'pdf'" :url="url"/>
    <TxtViewer v-else-if="fileType === 'txt' || fileType === 'java' || fileType === 'vue' || fileType === 'js' || fileType === 'c' || fileType === 'cpp' || fileType === 'html' || fileType === 'css'" :url="url"/>
    <MusicViewer v-else-if="fileType === 'mp3' || fileType === 'wma' || fileType === 'wav' || fileType === 'ape' || fileType === 'flac' || fileType === 'ogg' || fileType === 'acc'" :url="url"/>
    <PictureViewer v-else-if="fileType === 'bmp' || fileType === 'jpeg' || fileType === 'png' || fileType === 'svg' || fileType === 'psd' || fileType === 'jpg' || fileType === 'gif'" :url="url"/>
    <VideoViewer v-else-if="fileType === 'mp4' || fileType === 'avi' || fileType === 'dat' || fileType === 'flv' || fileType === 'm4v' || fileType === 'wmv' || fileType === 'asf' || fileType === 'mkv' || fileType === 'mpeg'" :url="url"/>
    <CompressViewer v-else-if="fileType === 'zip' || fileType === 'rar' || fileType === '7z' || fileType === 'tar' || fileType === 'gz' || fileType === 'bz2'" :url="url"/>
    <div class="null" v-else>不支持预览此文件</div>
  </div>
</template>

<style scoped>
.null {
  font-size: 1.3em;
  margin: 10px auto auto 15px;
}
.viewer {
  width: calc(100vw - 80px);
  height: calc(100vh - 82px);
}
</style>
