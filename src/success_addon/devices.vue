<template>
  <div
    class="mapl-login-panel"
    :class="{ active: isActive }"
    :style="{top: top+'%', left: left+'%'}"
  >
    <div class="header">
      <h3>在线设备</h3>
    </div>
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
        <td>在线</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { get_user_info, get_self_info } from "Util/rpc/rpc-client.js"
export default {
  data() {
    return {
      isActive: false,
      top: 50,
      left: 50,
    }
  },
  asyncComputed: {
    async device() {
      try {
        const user_data = await get_user_info()
        const self_data = await get_self_info(user_data.user_name)
        console.table(self_data["device"])
        return self_data["device"]
      } catch (e) {
        console.error(e)
      }
    },
  },
  methods: {},
  created: function () {
    setTimeout(() => {
      this.isActive = true
    }, 50)
    setTimeout(() => {
      this.left = 70
      this.top = 27
    }, 100)
  },
}
</script>

<style lang="scss">
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
</style>
