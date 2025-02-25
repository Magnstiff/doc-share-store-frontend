<script>
import VuePdfEmbed from 'vue-pdf-embed'
import { createLoadingTask } from 'vue3-pdfjs'

export default {
  name: 'PdfViewer',
  components: { VuePdfEmbed },
  props: ['url'],
  data () {
    return {
      loading: false,
      pageNum: 1,
      scale: 1,
      numPages: 0,
      inputting: false,
      inputtingValue: 1
    }
  },
  mounted () {
    this.loading = true
    createLoadingTask(this.url).promise.then(pdf => {
      this.loading = false
      this.numPages = pdf.numPages
    })
    this.pageNum = 1 || this.$route.query.page
  },
  methods: {
    lastPage () {
      if (this.pageNum > 1) {
        this.pageNum -= 1
      }
    },
    nextPage () {
      if (this.pageNum < this.numPages) {
        this.pageNum += 1
      }
    },
    pageZoomOut () {
      if (this.scale < 2) {
        this.scale += 0.1
      }
    },
    pageZoomIn () {
      if (this.scale > 1) {
        this.scale -= 0.1
      }
    },
    stopInput () {
      this.inputting = false
      if (isNaN(Number(this.inputtingValue))) {
        this.inputtingValue = this.pageNum
      }
      if (this.inputtingValue > this.numPages) {
        this.inputtingValue = Number(this.numPages)
      }
      if (this.inputtingValue < 1) {
        this.inputtingValue = 1
      }
      this.pageNum = Number(this.inputtingValue)
    }
  }
}
</script>

<template>
  <div class="viewer">
    <a-spin v-if="loading" class="loading" size="large" tip="加载时间较长，请耐心等待"/>
    <div class="pdf-bed">
      <vue-pdf-embed :source="url" :width="scale * 515" class="vue-pdf-embed" :page="pageNum"/>
    </div>

    <a-button-group class="page-tool">
      <a-button type="primary" @click="lastPage">上一页</a-button>
      <a-button type="primary" @click="nextPage">下一页</a-button>
      <a-button type="primary" @click="inputting = true">
        <span v-if="!inputting"> {{this.pageNum}} </span>
        <a-input v-else v-model:value="inputtingValue" @blur="stopInput" @keydown.enter="stopInput" style="width: 60px;height: 100%;margin-right: 10px"/>
        /{{this.numPages}}
      </a-button>
      <a-button type="primary" @click="pageZoomOut">放大</a-button>
      <a-button type="primary" @click="pageZoomIn">缩小</a-button>
    </a-button-group>
  </div>
</template>

<style scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.viewer {
  width: 100%;
  height: 100%;
}

.pdf-bed {
  width: 100%;
  height: 100%;
  overflow: scroll;
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.vue-pdf-embed {
  height: auto;
  margin: 0 auto;
}

.page-tool {
  position: absolute;
  bottom: 35px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  align-items: center;
  margin-left: 50%;
  transform: translateX(-50%);
}

</style>
