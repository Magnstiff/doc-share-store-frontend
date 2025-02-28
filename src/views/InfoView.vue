<script>
export default {
  name: 'InfoView',
  inject: ['$axios'],
  data() {
    return {
      interval: null,
      systemInfo: {
        "time": "2025-01-01 00:00:00",
        "static": {
          "pc": "",
          "cpu": "",
          "os": ""
        },
        "realtime": {
          "temperature": "0%",
          "battery": "0%",
          "cpu": "0.0%",
          "memory": "0.0GB/0.0GB(0.0%)",
          "disk": "0.0GB/0.0GB(0.0%)"
        }
      }
    }
  },
  methods: {
    getIP() {
      return window.location.hostname
    },
    getSystemInfo() {
      this.$axios.get('/systemInfo').then(res => {
        this.systemInfo = res.data
      })
    }
  },
  beforeMount() {
    this.getSystemInfo()
    this.interval = setInterval(() => {
      this.getSystemInfo()
    }, 500);
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<template>
  <a-page-header style="border: 1px solid rgb(235, 237, 240);background-color:#eee;" title="详情" />
  <div>支持文件批量下载、上传、预览等功能</div>
  <div style="font-weight: bold;">服务器时钟</div>
  <div>{{ systemInfo.time }}</div>
  <div style="font-weight: bold;">服务详情</div>
  <div>http server: http://{{ getIP() }}:80 <span style="color: green;">working</span></div>
  <div>ftp server: ftp://{{ getIP() }}:21 <span style="color: green;">working</span></div>
  <div>git server: http://{{ getIP() }}:3001/exmaple.git <span style="color: green;">working</span></div>
  <div style="font-weight: bold;">服务器基本信息</div>
  <div>CPU: {{ systemInfo.static.cpu }}</div>
  <div>操作系统: {{ systemInfo.static.os }}</div>
  <div>组装信息: {{ systemInfo.static.pc }}</div>
  <div style="font-weight: bold;">资源信息</div>
  <div>温度: {{ systemInfo.realtime.temperature }}</div>
  <div>电量: {{ systemInfo.realtime.battery }}</div>
  <div>CPU: {{ systemInfo.realtime.cpu }}</div>
  <div>内存: {{ systemInfo.realtime.memory }}</div>
  <div>磁盘: {{ systemInfo.realtime.disk }}</div>
</template>

<style scoped></style>
