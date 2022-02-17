// import "Util/rpc/rpc-server.js"
import "Util/omnibox/index.js"

// import devtools from "@vue/devtools"

import Vue from "vue"
import Vuex from "vuex"

import settings from "Util/store/vuex-module/settings.js"
import StoreSync from "Util/store/store-sync.js"
import { RPCSync } from "Util/store/rpc-sync.js"

Vue.use(Vuex)

// devtools.connect()