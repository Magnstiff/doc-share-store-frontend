<script>
import { CloseCircleFilled } from '@ant-design/icons-vue'

export default {
  name: 'DownloadList',
  components: { CloseCircleFilled },
  computed: {
    downloadInfo () {
      return this.$store.state.downloadInfo
    }
  },
  methods: {
    cancelDownload (index) {
      this.$store.commit('cancelDownload', index)
    }
  }
}
</script>

<template>
  <a-page-header style="border: 1px solid rgb(235, 237, 240);background-color:#eee;" title="下载列表"/>
  <div class="null" v-if="downloadInfo.downloadList.length === 0">无下载任务</div>
  <div class="main" v-else>
    <div v-for="(item, index) in downloadInfo.downloadList" :key="index">
      <div class="line" v-if="index !== 0"/>
      <a-row class="main-progress">
        <a-row>当前任务：<span style="font-weight: bold">{{item.fileName}}<span style="color: #e11;margin-left: 10px" v-if="item.status === 'canceled'">(已取消)</span></span></a-row>
        <div class="progress-show">
          <a-progress :percent="item.downloadPercent"/>
          <CloseCircleFilled v-if="item.status === 'downloading'" @click="cancelDownload(index)" style="color: red;position: relative;top: -2px"/>
        </div>
        <a-row>
          <a-col>进度： {{ item.downloadedSize }} / {{ item.fileSize }}</a-col>
          <a-col style="margin-left: 30px">下载速度：{{ item.downloadSpeed }}</a-col>
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
