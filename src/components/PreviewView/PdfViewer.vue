<script>

export default {
  name: 'PdfViewer',
  props: ['url'],
  inject: ['$axios'],
  beforeMount() {
    this.$axios.get(this.url, { responseType: 'arraybuffer' }).then((response) => {
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      this.$el.querySelector('iframe').src = url
    })
  },
}
</script>

<template>
  <div class="viewer">
    <iframe width="100%" height="100%"></iframe>
  </div>
</template>

<style scoped></style>
