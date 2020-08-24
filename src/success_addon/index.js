// const browser = require("webextension-polyfill/dist/browser-polyfill")
import Vue from "vue"
import Vuex from "vuex"
import AsyncComputed from 'vue-async-computed'

import Devices from "./devices.vue"
import Liuliang from "./liuliang.vue"
import {RPCSyncClient} from "Util/store/rpc-sync.js"
import settings from "Util/store/vuex-module/settings.js"

const devices = document.createElement('div')
devices.id = 'mapl-devices'
document.body.appendChild(devices)
const liuliang = document.createElement('div')
liuliang.id = 'mapl-liuliang'
document.body.appendChild(liuliang)

//Vue.config.productionTip = false;
setTimeout(() => {
    document.querySelector('div.login-panel').style.left = '30%'
}, 50)

Vue.use(Vuex)
Vue.use(AsyncComputed)
//TODO: 实现Vuex广播同步机制
const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    plugins: [RPCSyncClient({
      storeName: 'rpc',
      storeModule: settings
    })],
    state: {
      isUserInfoInited: false,
      isSelfInfoInited: false,
      user_info: {},
      self_info: {},
      setting: {
        successAddon: {
          userDeviceNote : {}
        }
      }
    },
    mutations: {
      user_info_update(state, user_info) {
        state.user_info = user_info
        state.isUserInfoInited = true
      },
      self_info_update(state, self_info) {
        state.self_info = self_info
        state.isSelfInfoInited = true
      },
      set_successAddon_userDeviceNote(state, {mac, note}) {
        Vue.set(state.setting.successAddon.userDeviceNote, mac, note)
      }
    },
    actions: {
      async get_user_info({commit}) {
        // const user_info = await get_user_info()
        const user_info = {}
        commit('user_info_update', user_info)
      },
      async get_self_info({commit, state}) {
        // const self_info = await get_self_info(state.user_info.user_name)
        const self_info = {username: state.user_info.user_name}
        // console.log('test', self_info)
        commit('self_info_update', self_info)
      }
    }
  })
store.dispatch('get_user_info').then(()=>{
  store.dispatch('get_self_info')
})
new Vue({
    render: h => h(Devices),
    store
}).$mount('#mapl-devices')
new Vue({
    render: h => h(Liuliang),
    store
}).$mount('#mapl-liuliang')
setInterval(()=>{
  store.dispatch('rpc/RPCTest').then().catch((e)=>{
    console.error(JSON.stringify(e))
  })
}, 1)
