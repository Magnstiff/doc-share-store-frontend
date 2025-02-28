<script>
import { stringToSize, sizeToString } from '../common/index.js'

export default {
  name: 'DownloadList',
  computed: {
    taskList() {
      return this.$store.state.taskList
    }
  },
  methods: {
    sizeToString,
  }
}
</script>

<template>
  <a-page-header style="border: 1px solid rgb(235, 237, 240);background-color:#eee;" title="任务列表" />
  <div class="null" v-if="taskList.length === 0">无下载/上传任务</div>
  <div class="main" v-else>
    <div v-for="(item, index) in taskList" :key="index">
      <a-row class="main-progress">
        <a-row>
          <span>当前任务：</span>
          <span style="font-weight: bold">{{ item.name }}</span>
        </a-row>
        <div class="progress-show">
          <a-progress :percent="item.finish / item.size * 100" />
        </div>
        <a-row>
          <a-col>进度： {{ sizeToString(item.finish) }} / {{ sizeToString(item.size) }}</a-col>
        </a-row>
      </a-row>
    </div>
  </div>
</template>

<style scoped>
.main {
  height: calc(100vh - 82px);
  width: 100%;
  overflow-y: scroll;
}

.main-progress {
  display: flex;
  flex-direction: column;
  margin: 20px 10px;
  background-color: #f1f1f1;
  padding: 20px 40% 20px 20px;
}

.progress-show {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.line {
  border-top: 1px dashed #aaa;
  margin: 20px auto 20px 0;
}

.null {
  font-size: 1.3em;
  margin: 10px auto auto 15px;
}
</style>
