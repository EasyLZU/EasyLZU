<template>
  <div class="mapl-device-o-container">
    <div
      class="mapl-device-o-transer"
      :class="{'mapl-device-o-transer-inputing': isInputing || isHover}"
      @mouseleave="isHover=false"
      @mouseenter="isHover=true"
    >
      <div class="mapl-device-o-shower">{{realNote}}</div>
      <div class="mapl-device-o-shower" v-if="!isInputing && mac != deviceMac">
        <div class="mapl-device-o-inliner" @click="onRInput()">设置备注</div>|
        <div class="mapl-device-o-inliner" @click="dis()">下线</div>
      </div>
      <div class="mapl-device-o-shower" v-else-if="!isInputing && mac == deviceMac" @click="onRInput()">
        设置备注
      </div>
      <div class="mapl-device-o-shower" v-else>
        <input
          class="mapl-device-o-inputer"
          type="text"
          placeholder="输入备注..."
          v-focus
          v-model="noteText"
          @blur="onFInput()"
          @keypress.enter="onFInput()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { dis_mac } from 'util/rpc/rpc-client.js'
export default {
  data() {
    return {
      test: false,
      isInputing: false,
      isHover: false,
      noteText: ""
    }
  },
  methods: {
    dis() {
      dis_mac(this.uid, this.mac, this.csrf_token).then(() => {
        location.reload()
      })

    },
    onRInput() {
      this.noteText = this.$store.state.mac_info[this.mac] || ''
      this.isInputing = true
    },
    onFInput() {
      this.isInputing = false
      if(this.noteText.length) {
        this.updateNote()
      }
    },
    updateNote() {
      this.$store.commit('mac_info_update', {mac:this.mac, note:this.noteText})
    }
  },
  created() {
    this.updateNote = _.debounce(this.updateNote, 500)
  },
  props: {
    mac: String,
    uid: String,
    csrf_token: String
  },
  computed: {
    deviceMac() {
      return this.$store.state.user_info.user_mac
    },
    realNote() {
      const userNote = this.$store.state.mac_info[this.mac]
      if(this.deviceMac == this.mac) {
        if(userNote) {
          return `${userNote}(本机)`
        }
        return '本机'
      } else {
        if(userNote) {
          return `${userNote}`
        }
        return '在线'
      }
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      },
    },
  },
}
</script>

<style>
.mapl-device-o-container {
  overflow: hidden;
  width: 200%;
  height: 100%;
}
.mapl-device-o-transer {
  transition: transform 0.5s;
}
.mapl-device-o-transer-inputing {
  transform: translate(-50%, 0);
}
.mapl-device-o-shower {
  float: left;
  width: 50%;
}
.mapl-device-o-inliner {
  cursor: pointer;
  display: inline-block;
  padding: 0 2px;
}
.mapl-device-o-inputer {
  border-style: solid;
  border-width: 1px;
  border-color: white;
  padding: 0 6px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 9px;
  width: 80%;
}
</style>