<template>
  <div
    class="mapl-login-panel"
    :class="{ active: isActive }"
    :style="{top: top+'%', left: left+'%'}"
  >
    <div class="header">
      <h3>已购流量包</h3>
    </div>
    <transition name="mapl-loadinfo-trans">
      <div
        v-if="!isInited"
        key="tip"
        class="mapl-liuliang-tip"
        :class="{ 'mapl-tranan-tip': isOverTime }"
      >
        <p>拉取信息中...</p>
      </div>
      <div
        v-else
        key="info"
        class="mapl-liuliang-info"
        :class="{ 'mapl-tranan-liuliang': isOverTime }"
      >
        <table class="mapl-liuliang-table">
          <tr>
            <th>名称</th>
            <th>购买日期</th>
            <th>统计</th>
          </tr>
          <tr v-for="(item, index) of liuliang" :key="index">
            <td>{{item.name}}</td>
            <td>{{item.purchase_date}}</td>
            <!-- TODO:流量展示组件 -->
            <td>
              <liuliang-display :remain="item.remain" :percentage="item.percentage"></liuliang-display>
            </td>
          </tr>
        </table>
      </div>
    </transition>
  </div>
</template>

<script>
import LiuliangDisplay from "./liuliang-display.vue"
export default {
  data() {
    return {
      isActive: false,
      top: 50,
      left: 50,
      isOverTime: false
    }
  },
  computed: {
    isInited() {
      return (
        this.$store.state.isUserInfoInited && this.$store.state.isSelfInfoInited
      )
    },
    liuliang() {
      try {
        return this.$store.state.self_info["liuliang"]
      } catch (e) {
        console.error(e)
        return []
      }
    },
  },
  asyncComputed: {},
  methods: {},
  created: function () {
    setTimeout(() => {
      this.isActive = true
    }, 50)
    setTimeout(() => {
      this.left = 70
      this.top = 60
    }, 100)
    setTimeout(() => {
      this.isOverTime = !this.isInited
    }, 1200)
  },
  components: {
    LiuliangDisplay,
  },
}
</script>

<style lang="scss">
.mapl-login-panel {
  position: fixed;
  width: 450px;
  top: 50%;
  left: 50%;
  opacity: 0;
  transform: translate(-50%, -50%) rotateY(180deg) scale(0.8);
  padding: 20px;
  border-radius: 20px;
  box-sizing: border-box;
  filter: alpha(opacity=70);
  background: rgba(0, 0, 0, 0.7);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
  color: #fff;
  transition: all 1s;
}
.mapl-login-panel.active {
  opacity: 1;
  transform: translate(-50%, -50%) rotateY(0deg) scale(1);
}
.mapl-liuliang-table {
  text-align: center;
  width: 100%;
}
.mapl-loadinfo-trans-enter,
.mapl-loadinfo-trans-leave-to {
  max-height: 0;
}
.mapl-tranan-tip {
  transition: max-height 0.2s ease-in;
}
.mapl-tranan-liuliang {
  transition: max-height 0.8s linear;
}
.mapl-liuliang-info {
  max-height: 200px;
  overflow: hidden;
}
.mapl-liuliang-tip {
  max-height: 25px;
  overflow: hidden;
}
</style>
