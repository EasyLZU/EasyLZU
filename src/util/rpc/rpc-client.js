const browser = require("webextension-polyfill/dist/browser-polyfill")

export async function get_user_info() {
    const response = await fetch('http://10.10.0.166/cgi-bin/rad_user_info?callback=' + get_callback_name())
    const jsonp = await response.text()
    const data = JSON.parse(jsonp.replace(/(?:^.*\()|(?:\).*$)/g, ''))
    return {
        online_ip: data.online_ip,
        products_name: data.products_name,
        user_mac: data.user_mac,
        user_name: data.user_name
    }
}
export async function get_self_info(username) {
    return await rpc_client('get_self_info', {
        username
    })
}

function rpc_client(command, msg) {
    return new Promise((resolve, reject) => {
        const port = browser.runtime.connect({
            name: 'rpc'
        })
        port.onMessage.addListener(function (msg) {
            resolve(msg)
        })
        port.onDisconnect.addListener((p) => {
            reject(p)
        })
        port.postMessage({
            command,
            msg
        })
    })
}

function get_callback_name() {
    return 'jQuery' + ('1.12.4' + Math.random()).replace(/\D/g, '') + '_' + (Date.now() + 1)
}
