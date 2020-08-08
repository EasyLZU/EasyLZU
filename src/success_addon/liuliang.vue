<template>
  <div
    class="mapl-login-panel"
    :class="{ active: isActive }"
    :style="{top: top+'%', left: left+'%'}"
  >
    <div class="header">
      <h3>已购流量包</h3>
    </div>
    <table class="mapl-devices-table">
      <tr>
        <th>名称</th>
        <th>购买日期</th>
        <th>统计</th>
      </tr>
      <tr v-for="(item, index) of liuliang" :key="index">
        <td>{{item.name}}</td>
        <td>{{item.purchase_date}}</td>
        <!-- TODO:流量展示组件 -->
        <td>{{item.remain}}</td>
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
    async liuliang() {
      try {
        const user_data = await get_user_info()
        const self_data = await get_self_info(user_data.user_name)
        console.table(self_data)
        return self_data["liuliang"]
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
      this.top = 60
    }, 100)
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
</style>
