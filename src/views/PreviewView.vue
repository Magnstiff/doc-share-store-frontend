<script>
import PdfViewer from '@/components/PreviewView/PdfViewer.vue'
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
  data() {
    return {
      viewerMap: {
        'PdfViewer': ['pdf'],
        'TxtViewer': ['txt', 'java', 'vue', 'js', 'c', 'cpp', 'html', 'css', 'ts', 'json', 'xml', 'md', 'py', 'php', 'sh', 'bat'],
        'MusicViewer': ['mp3', 'wma', 'wav', 'ape', 'flac', 'ogg', 'acc'],
        'PictureViewer': ['bmp', 'jpeg', 'png', 'svg', 'psd', 'jpg', 'gif'],
        'VideoViewer': ['mp4', 'avi', 'dat', 'flv', 'm4v', 'wmv', 'asf', 'mkv', 'mpeg'],
        'CompressViewer': ['zip', 'rar', '7z', 'tar', 'gz', 'bz2']
      },
      filePath: ''
    }
  },
  beforeMount() {
    this.filePath = this.$route.query.previewPath
  },
  computed: {
    fileType() {
      if (this.filePath) {
        const arr = this.filePath.split('.')
        return arr[arr.length - 1].toLowerCase()
      }
      return ''
    },
    viewerUesd() {
      for (const [viewer, types] of Object.entries(this.viewerMap)) {
        if (types.includes(this.fileType)) return viewer
      }
      return null
    }
  }
}
</script>

<template>
  <a-page-header style="border: 1px solid rgb(235, 237, 240);background-color:#eee;" title="预览" />
  <div class="viewer">
    <div class="null" v-if="!filePath">未选择预览文件，请从文件预览页面点击进入</div>
    <component v-else-if="viewerUesd" :is="viewerUesd" :url="`/preview?filePath=${filePath}`" />
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
