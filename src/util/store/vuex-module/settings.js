import Vue from "vue"
export default {
    namespaced: true,
    state: () => {
        return {
            test: '',
            test2: '',
            setting1: 1,
            setting2: ''
        }
    },
    mutations: {
        test(state) {
            state.test += 'test|'
        },
        SetSetting(state, data) {
            for(const k in data){
                Vue.set(state, k, data[k])
            }
        }
    }
}