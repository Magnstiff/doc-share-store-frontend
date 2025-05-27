<script>
export default {
  name: 'TxtViewer',
  props: ['url'],
  inject: ['$axios'],
  data() {
    return {
      content: '',
    }
  },
  beforeMount() {
    this.$axios.get(this.url).then((res) => {
      this.content = res.data
    })
  },
  computed: {
    contentArray() {
      if (this.content.split) {
        console.log(this.content)
        return this.content.split('\n')
      }
      return []
    },
  },
}
</script>

<template>
  <div class="main">
    <div class="viewer">
      <div class="left-bar">
        <template v-for="(item, index) in contentArray" :key="index">
          <div style="font-size: 1.1em">{{ index + 1 }}</div>
        </template>
      </div>
      <div class="content">
        <template v-for="(item, index) in contentArray" :key="index">
          <div style="font-size: 1.1em">{{ item ? item : '\n' }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'JetBrainsMono';
  src: url('font/JetBrainsMono-Medium.woff2') format('woff');
  font-weight: normal;
  font-style: normal;
}

.main {
  user-select: all;
  width: 100%;
  background-color: #fff;
  height: 100%;
}

.viewer {
  display: flex;
  flex-direction: row;
  overflow-y: scroll;
  height: 100%;
}

.left-bar {
  padding-right: 10px;
  padding-left: 15px;
  background-color: #eee;
  color: #444;
  height: fit-content;
}

.content {
  user-select: all;
  width: 100%;
  overflow-x: scroll;
  height: fit-content;
  margin-left: 6px;
}

.left-bar div {
  line-height: 1.3;
  font-size: 14px;
  text-align: right;
}

.content div {
  font-family: 'JetBrainsMono', Arial, sans-serif;
  user-select: auto;
  line-height: 1.3;
  font-size: 14px;
  overflow: visible;
  white-space: pre;
}

.content::-webkit-scrollbar {
  display: none;
}
</style>
