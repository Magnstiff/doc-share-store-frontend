<script>
import { FolderOutlined, CloudDownloadOutlined, InfoCircleOutlined, EyeOutlined } from '@ant-design/icons-vue'
export default {
  name: 'LayoutsiderBuild',
  components: { FolderOutlined, CloudDownloadOutlined, InfoCircleOutlined, EyeOutlined },
  data() {
    return {
      routers: {
        files: {
          key: 'files',
          icon: 'FolderOutlined',
          name: '文件'
        },
        download: {
          key: 'download',
          icon: 'CloudDownloadOutlined',
          name: '任务列表'
        },
        preview: {
          key: 'preview',
          icon: 'EyeOutlined',
          name: '预览'
        },
        info: {
          key: 'info',
          icon: 'InfoCircleOutlined',
          name: '信息'
        }
      }
    }
  },
  computed: {
    selectedKeys: {
      get() {
        return [this.$route.name]
      },
      set(data) { }
    }
  }
}
</script>

<template>
  <a-layout-sider :collapsed="true">
    <div class="logo">
      <img src="/favicon.ico" alt="log" />
    </div>

    <a-menu theme="dark" mode="inline" v-model:selectedKeys="selectedKeys">
      <template v-for="item in routers" :key="item.key">
        <a-menu-item>
          <router-link :to="{ name: item.key }">
            <component :is="item.icon" />
            <span>{{ item.name }}</span>
          </router-link>
        </a-menu-item>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<style scoped>
.logo {
  margin: 25px 0;
  text-align: center;
}

.logo img {
  height: 40px;
}
</style>