import Vue from "vue"
import AsyncComputed from 'vue-async-computed'

import Devices from "./devices.vue"
import Liuliang from "./liuliang.vue"

const devices = document.createElement('div')
devices.id = 'mapl-devices'
document.body.appendChild(devices)
const liuliang = document.createElement('div')
liuliang.id = 'mapl-liuliang'
document.body.appendChild(liuliang)

//Vue.config.productionTip = false;
setTimeout(()=>{
    document.querySelector('div.login-panel').style.left = '30%'
}, 50)

Vue.use(AsyncComputed)
new Vue({
    render: h => h(Devices)
}).$mount('#mapl-devices');
new Vue({
    render: h => h(Liuliang)
}).$mount('#mapl-liuliang');