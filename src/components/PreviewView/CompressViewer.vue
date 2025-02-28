<script>
import JSZip from 'jszip'

export default {
  name: 'CompressViewer',
  props: ['url'],
  inject: ['$axios'],
  data() {
    return {
      content: []
    }
  },
  beforeMount() {
    this.$axios.get(this.url, { responseType: 'blob' }).then(res => {
      const zip = new JSZip()
      zip.loadAsync(res.data).then(zip => {
        this.content = zip
      })
    })
  },
  methods: {
    getFileName() {
      if (this.url) {
        const arr = this.url.split('/')
        return arr[arr.length - 1]
      }
      return ''
    }
  }
}
</script>

<template>
  <div style="padding: 10px;">
    <div style="font-size: 2em;font-weight: 600;margin-bottom: 10px;">来自压缩包 {{ getFileName() }} 的文件内容</div>
    <template v-for="(value, key) in content.files">
      <div>{{ key }}</div>
    </template>
  </div>
</template>

<style scoped></style>
