<script>
export default {
  name: 'PictureViewer',
  props: ['url'],
  data () {
    return {
      scale: 1,
      drag: {
        onDrag: false,
        startX: 0,
        startY: 0
      }
    }
  },
  methods: {
    handleWheel (e) {
      // 在鼠标位置缩放
      const x = e.clientX
      const y = e.clientY
      const imgX = this.$refs.img.offsetLeft
      const imgY = this.$refs.img.offsetTop
      const diffX = x - imgX
      const diffY = y - imgY
      this.$refs.img.style.transformOrigin = `${diffX}px ${diffY}px`
      if (e.deltaY > 0) {
        this.scaleDown(0.05)
      } else {
        this.scaleUp(0.05)
      }
    },
    scaleUp (val) {
      if (this.scale >= 2) return
      this.scale += val
    },
    scaleDown (val) {
      if (this.scale <= 0.2) return
      this.scale -= val
    },
    handleMouseDown (e) {
      this.drag.onDrag = true
      this.drag.startX = e.clientX
      this.drag.startY = e.clientY
    },
    handleMouseMove (e) {
      if (!this.drag.onDrag) return
      const x = e.clientX
      const y = e.clientY
      const diffX = x - this.drag.startX
      const diffY = y - this.drag.startY
      this.drag.startX = x
      this.drag.startY = y
      this.$refs.img.style.left = `${this.$refs.img.offsetLeft + diffX}px`
      this.$refs.img.style.top = `${this.$refs.img.offsetTop + diffY}px`
    },
    handleMouseUp () {
      this.drag.onDrag = false
    },
    handleMouseLeave () {
      this.drag.onDrag = false
    }
  }
}
</script>

<template>
  <div class="viewer" @wheel="handleWheel">
    <div class="bar">
      <a-button type="primary" @click="scaleDown(0.1)" style="margin-right: 20px">缩小</a-button>
      <a-button type="primary" @click="scaleUp(0.1)">放大</a-button>
    </div>

    <div class="main">
      <img :src="url" alt="" ref="img" :style="{width: `${scale * 2000}px`}" @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp" @mouseleave="handleMouseLeave" draggable="false">
    </div>
  </div>
</template>

<style scoped>
.viewer {
  width: 100%;
  position: relative;
}

.main {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: scroll;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main::-webkit-scrollbar {
  display: none;
}

.main img {
  position: absolute;
}

.bar {
  background-color: #fff;
  position: absolute;
  z-index: 100;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}
</style>
