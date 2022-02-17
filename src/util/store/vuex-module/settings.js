import Vue from "vue"
export default {
    namespaced: true,
    state: () => {
        return {
            test: 0,
            test2: '',
            setting1: 1,
            setting2: ''
        }
    },
    mutations: {
        test(state) {
            state.test += 'test|'
        },
        SetSetting(state) {
            const data = {test: state.test+1}
            for(const k in data){
                Vue.set(state, k, data[k])
            }
        },
        _RPCSync_Init(state, data) {
            for (const k in data) {
                if(data[k]==null) {
                    continue
                }
                Vue.set(state, k, data[k])
            }
        },
        _StoreSync_Init(state, data) {
            for (const k in data) {
                if(data[k]==null) {
                    continue
                }
                Vue.set(state, k, data[k])
            }
        }
    },
    actions: { //不应访问state
        async RPCTest({commit}) {
            commit('SetSetting')
        }
    }
}