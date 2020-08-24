// import "Util/rpc/rpc-server.js"
import "Util/omnibox/index.js"

// import devtools from "@vue/devtools"

import Vue from "vue"
import Vuex from "vuex"

import settings from "Util/store/vuex-module/settings.js"
import StoreSync from "Util/store/store-sync.js"
import {RPCSync} from "Util/store/rpc-sync.js"

Vue.use(Vuex)
const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    plugins: [StoreSync({
        storeName: 'settings',
        storeModule: settings,
        storeType: 'localStorage'
    }), RPCSync({
        storeName: 'rpc',
        storeModule: settings
    })],
    state: {},
    mutations: {}
})
store.commit('settings/test')
store.commit('settings/SetSetting', {
    setting1: 123,
    setting2: '0'
})

// devtools.connect()