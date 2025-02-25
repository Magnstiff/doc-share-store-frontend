<script>
export default {
  name: 'MusicViewer',
  props: ['url'],
  computed: {
    getMusicName () {
      if (this.url) {
        const arr = this.url.split('/')
        return arr[arr.length - 1]
      }
      return ''
    }
  }
}
</script>

<template>
  <div class="main">
    <div class="player">
      <div class="name">当前播放：{{ getMusicName }}</div>
      <audio :src="url" controls class="music"></audio>
    </div>
  </div>
</template>

<style scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player {
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ddf;
  padding: 60px 20px 40px 20px;
  border-radius: 10px;
}

.name {
  font-size: 1.3em;
  margin-bottom: 40px;
  font-weight: bold;
  white-space: nowrap;
}

.music {
  transition: .3s;
  width: 400px;
  border-radius: 24px;
}

.music:hover {
  box-shadow: 0 0 20px #aaa;
}
</style>
