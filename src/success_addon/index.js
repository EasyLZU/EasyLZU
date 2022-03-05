import Vue from "vue"
import Vuex from "vuex"
import AsyncComputed from 'vue-async-computed'

import Devices from "./devices.vue"
import Liuliang from "./liuliang.vue"

import { get_user_info, get_self_info, get_mac_info } from "util/rpc/rpc-client.js"

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
const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
      isUserInfoInited: false,
      isSelfInfoInited: false,
      user_info: {},
      self_info: {},
      mac_info: {}
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
      mac_info_update(state, {mac, note}) {
        Vue.set(state.mac_info, mac, note)
      }
    },
    actions: {
      async get_user_info({commit}) {
        const user_info = await get_user_info()
        commit('user_info_update', user_info)
      },
      async get_self_info({commit, state}) {
        const self_info = await get_self_info(state.user_info.user_name)
        commit('self_info_update', self_info)
      },
      async init_mac_info({commit}) {
        const mac_info = await get_mac_info()
        for (const info of mac_info['mac_info']) {
          console.log(info)
          commit('mac_info_update', info)
        }
      }
    }
  })
store.dispatch('get_user_info').then(() => {
  store.dispatch('get_self_info').then(() => {
    store.dispatch('init_mac_info')
  })
})
new Vue({
    render: h => h(Devices),
    store
}).$mount('#mapl-devices')
new Vue({
    render: h => h(Liuliang),
    store
}).$mount('#mapl-liuliang')
