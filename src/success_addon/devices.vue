<template>
  <div
    class="mapl-login-panel"
    :class="{ active: isActive }"
    :style="{top: top+'%', left: left+'%'}"
  >
    <div class="header">
      <h3>在线设备</h3>
      <div class="lang mapl-devices-lang">
        <span @click="openMac()">无感知认证管理</span>
      </div>
    </div>
    <transition name="mapl-loadinfo-trans">
      <div
        v-if="!isInited"
        key="tip"
        class="mapl-devices-tip"
        :class="{ 'mapl-tranan-tip': isOverTime }"
      >
        <p>拉取信息中...</p>
      </div>
      <div
        v-else
        key="info"
        class="mapl-devices-info"
        :class="{ 'mapl-tranan-device': isOverTime }"
      >
        <table class="mapl-devices-table">
          <tr>
            <th>IP</th>
            <th>MAC</th>
            <th class="mapl-devices-option"></th>
          </tr>
          <tr v-for="item of device" :key="item.mac">
            <td>{{ item.ip }}</td>
            <td>{{ item.mac }}</td>
            <!-- TODO:下线按钮组件 -->
            <td>
              <devices-option :mac="item.mac" :uid="item.id" :csrf_token="homeCsrfToken"></devices-option>
            </td>
          </tr>
        </table>
      </div>
    </transition>
  </div>
</template>

<script>
import DevicesOption from "./devices-option.vue"
export default {
  data() {
    return {
      isActive: false,
      top: 50,
      left: 50,
      isOverTime: false //超时未加载完成 TODO:分离成两个
    }
  },
  computed: {
    isInited() {
      return (
        this.$store.state.isUserInfoInited && this.$store.state.isSelfInfoInited
      )
    },
    user() {
      return this.$store.state.user_info
    },
    device() {
      try {
        return this.$store.state.self_info["device"]
      } catch (e) {
        console.error(e)
        return []
      }
    },
    homeCsrfToken() {
      return this.$store.state.self_info["csrf_token"]
    }
  },
  asyncComputed: {},
  methods: {
    openMac() {
      window.open(`http://${document.location.hostname}:8800/user/mac-auth`, "_blank")
    }
  },
  created: function () {
    setTimeout(() => {
      this.isActive = true
    }, 50)
    setTimeout(() => {
      this.left = 70
      this.top = 27
    }, 100)
    setTimeout(() => {
      this.isOverTime = !this.isInited
    }, 1200)
  },
  components: {
    DevicesOption,
  },
}
</script>

<style lang="scss">
.mapl-devices-lang {
  border: 1px solid #fff;
  border-radius: 10px;
  padding: 4px 8px;
}
.mapl-devices-table {
  text-align: center;
  width: 100%;
}
.mapl-devices-table .mapl-devices-option {
  width: 30%;
}
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
.mapl-loadinfo-trans-enter,
.mapl-loadinfo-trans-leave-to {
  max-height: 0;
}
.mapl-tranan-tip {
  transition: max-height 0.2s ease-in;
}
.mapl-tranan-device {
  transition: max-height 0.8s linear;
}
.mapl-devices-info {
  max-height: 200px;
  overflow: hidden;
}
.mapl-devices-tip {
  max-height: 25px;
  overflow: hidden;
}
</style>
