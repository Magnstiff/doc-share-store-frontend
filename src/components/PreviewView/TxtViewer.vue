<script>

export default {
  name: 'TxtViewer',
  props: ['url'],
  inject: ['$axios'],
  data () {
    return {
      content: ''
    }
  },
  beforeMount () {
    this.$axios.get(this.url.replace('/api', '')).then(res => {
      this.content = res.data
    })
  },
  computed: {
    contentArray () {
      return this.content.split('\n')
    }
  }
}
</script>

<template>
  <div class="main">
    <div class="viewer">

      <div class="left-bar">
        <template v-for="(item, index) in contentArray" :key="index">
          <div>{{ index + 1 }}</div>
        </template>
      </div>

      <div class="content">
        <template v-for="(item, index) in contentArray" :key="index">
          <div>{{ item }}</div>
        </template>
      </div>

    </div>
  </div>
</template>

<style scoped>
.main {
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
  width: 100%;
  overflow-x: scroll;
  height: fit-content;
  margin-left: 6px;
}

.left-bar div {
  line-height: 1.5;
  font-size: 14px;
  text-align: right;
}

.content div {
  tab-size: 4;
  line-height: 1.5;
  font-size: 14px;
  overflow: visible;
  white-space: pre;
}

.content::-webkit-scrollbar {display:none}

</style>
