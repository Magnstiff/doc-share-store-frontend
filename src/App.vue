<script>
import { computed } from 'vue'
import LayoutsiderBuild from './components/Layout/LayoutsiderBuild.vue'

export default {
  name: 'App',
  components: { LayoutsiderBuild },
  data() {
    return {}
  },
  provide() {
    return {
      downloadInfo: computed(() => this.downloadInfo)
    }
  }
}
</script>

<template>
  <a-layout style="min-height: 100vh;max-height: 100vh">
    <LayoutsiderBuild />
    <a-layout style="max-height: 100vh">
      <a-layout-content>
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style>
* {
  user-select: none;
  padding: 0;
  margin: 0;
}
</style>
