import "util/rpc/rpc-server.js"
import "util/omnibox/index.js"

import devtools from "@vue/devtools"

import Vue from "vue"
import Vuex from "vuex"
import StoreSync from "util/store/store-sync.js"
import settings from "util/store/vuex-module/settings.js"

import {
    RPCSyncServer
} from "util/rpc/rpc-base.js"
const syncstore = {
    namespaced: true,
    state: () => {
        return {
            setting1: 1,
            setting2: ''
        }
    },
    mutations: {
        SetSetting(state, data) {
            for (const k in data) {
                Vue.set(state, k, data[k])
            }
        }
    }
}

function RPCSync(option) {
    return function (store) {
        const rss = new RPCSyncServer(async (data) => {
            console.log(data)
            return store.state
        }, async (data) => {
            console.log(data)
            return store.state
        })
        store.registerModule(option.storeName, option.storeModule)
        store.subscribe((mutation, state) => {
            if (!mutation.type.startsWith(`${option.storeName}/`)) {
                return
            }
            const datas = state[option.storeName]
            console.log('推送根状态更新', JSON.stringify(datas))
            rss.commitSync({
                commitModule: option.storeName,
                commitType: mutation.type,
                commitData: datas
            })
        })
    }
}
Vue.use(Vuex)
const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    plugins: [StoreSync({
        storeName: 'settings',
        storeModule: settings,
        storeType: 'localStorage'
    }), RPCSync({
        storeName: 'rpc',
        storeModule: syncstore
    })],
    state: {},
    mutations: {}
})
store.commit('settings/test')
store.commit('settings/SetSetting', {
    setting1: 123,
    setting2: '0'
})
store.commit('rpc/SetSetting', {
    setting1: 123456,
    setting2: 'testRPC'
})
setTimeout(()=>{
    store.commit('rpc/SetSetting', {
        setting1: 123456,
        setting2: 'testRPC'
    })
}, 1000)
devtools.connect()