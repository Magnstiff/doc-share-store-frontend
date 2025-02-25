import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/files'
  },
  {
    path: '/files',
    name: 'files',
    component: () => import('../views/FilesView.vue')
  },
  {
    path: '/download',
    name: 'download',
    component: () => import('../views/DownloadList.vue')
  },
  {
    path: '/info',
    name: 'info',
    component: () => import('../views/InfoView.vue')
  },
  {
    path: '/preview',
    name: 'preview',
    component: () => import('../views/PreviewView.vue')
  }
]

export default createRouter({
  base: '/',
  history: createWebHashHistory(),
  routes
})
