<script>
export default {
  name: 'VideoViewer',
  props: ['url'],
  inject: ['$axios'],
  data() {
    return {
      content: ''
    }
  },
  beforeMount() {
    this.$axios.get(this.url, { responseType: 'blob' }).then(res => {
      this.content = URL.createObjectURL(res.data)
    })
  }
}
</script>

<template>
  <div class="viewer" style="display: flex;align-items: center;justify-content: center">
    <video :src="content" controls style="max-width: 100%;max-height: 100%"></video>
  </div>
</template>

<style scoped></style>
