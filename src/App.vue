<script>
import { FolderOutlined, CloudDownloadOutlined, InfoCircleOutlined, EyeOutlined } from '@ant-design/icons-vue'
import logo from './assets/favicon.ico'
import { message } from 'ant-design-vue'
import { computed } from 'vue'

export default {
  name: 'App',
  components: { FolderOutlined, CloudDownloadOutlined, InfoCircleOutlined, EyeOutlined },
  data () {
    return {
      logo
    }
  },
  async beforeCreate () {
    const ua = navigator.userAgent.toLowerCase()
    this.$store.commit('setUA', {
      isMobile: ua.match(/(iphone|ipod|android|ios)/i),
      isWechat: ua.match('micromessenger')
    })
    if (this.$store.state.ua.isMobile) {
      message.warn('您当前使用手机访问站点，分辨率可能会有问题')
    }
    if (this.$store.state.ua.isWechat) {
      message.warn('请勿使用微信内置浏览器，否则无法下载文件！')
    }
  },
  computed: {
    selectedKeys: {
      get () {
        return [this.$route.name]
      },
      set (data) {}
    }
  },
  provide () {
    return {
      downloadInfo: computed(() => this.downloadInfo)
    }
  }
}
</script>
<template>
<!--  <DownloadTask/>-->
  <a-layout style="min-height: 100vh;max-height: 100vh">
    <a-layout-sider :collapsed="true">
      <div class="logo">
        <img :src="logo" alt="log"/>
      </div>
      <a-menu theme="dark" mode="inline" v-model:selectedKeys="selectedKeys">
        <a-menu-item key="files">
          <router-link :to="{name: 'files'}">
            <FolderOutlined/>
            <span>文件</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="download">
          <router-link :to="{name: 'download'}">
            <CloudDownloadOutlined/>
            <span>下载列表</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="preview">
          <router-link :to="{name: 'preview'}">
            <EyeOutlined/>
            <span>预览</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="info">
          <router-link :to="{name: 'info'}">
            <InfoCircleOutlined/>
            <span>信息</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout style="max-height: 100vh">
      <a-layout-content>
        <router-view/>
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

.logo {
  margin: 25px 0;
  text-align: center;
}

.logo img {
  height: 40px;
}
</style>
