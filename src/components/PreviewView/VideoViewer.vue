<script>
export default {
  name: 'VideoViewer',
  props: ['url']
}
</script>

<template>
  <div class="viewer" style="display: flex;align-items: center;justify-content: center">
    <video :src="url" controls style="max-width: 100%;max-height: 100%"></video>
  </div>
</template>

<style scoped>

</style>
