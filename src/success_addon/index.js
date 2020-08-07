import Vue from "vue"

import App from "./test.vue"

const app = document.createElement('div')
app.id = 'app'
document.body.appendChild(app)

Vue.config.productionTip = false;

new Vue({
    render: h => h(App)
}).$mount('#app');