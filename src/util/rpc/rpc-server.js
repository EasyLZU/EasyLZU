const browser = require("webextension-polyfill/dist/browser-polyfill")

browser.runtime.onConnect.addListener((p) => {
    if (p.name == 'rpc') {
        p.onMessage.addListener(function (req) {
            if (req['command'] == 'get_self_info') {
                get_self_info(req.msg).then((data) => {
                    p.postMessage(data)
                })
            } else if (req['command'] == 'get_mac_info') {
                get_mac_info(req.msg).then((data) => {
                    p.postMessage(data)
                })
            } else if (req['command'] == 'update_mac_info') {
                update_mac_info(req.msg).then((data) => {
                    p.postMessage(data)
                })
            }
        })
    } else {
        p.postMessage()
    }
})
async function get_self_info({
    hostname,
    username
}) {
    if (!["10.10.0.166", "login.lzu.edu.cn"].includes(hostname)) return null
    const response = await fetch(`http://${hostname}:8800/site/sso?data=` + btoa(`${username}:${username}`))
    const body = await response.text()
    return parse_self_info(body)
}
async function get_mac_info({
    hostname
}) {
    if (!["10.10.0.166", "login.lzu.edu.cn"].includes(hostname)) return null
    const response = await fetch(`http://${hostname}:8800/user/mac-auth`, {credentials : "include"})
    const body = await response.text()
    return parse_mac_info(body)
}
async function update_mac_info({
    hostname, mac, note, csrf_token
}) {
    await fetch(`http://${hostname}:8800/user/mac-auth`, {
        "credentials": "include",
        "headers": {
            "X-CSRF-Token": csrf_token,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest"
        },
        "referrer": "http://10.10.0.166:8800/user/mac-auth",
        "body": (new URLSearchParams({
            _csrf: csrf_token,
            hasEditable: 1,
            editableIndex: "2",
            editableKey: "2",
            editableAttribute: "remark",
            mac: mac,
            remark: note
        })).toString(),
        "method": "POST",
        "mode": "cors"
    })
}

function parse_self_info(str) {
    const regxs1 = '<td data-col-seq="1">([^<]+)</td><td data-col-seq="2">([^<]+)</td>' +
        '<td data-col-seq="5">([^<]+)</td><td class="[^"]+" style="[^"]+" data-col-seq="7">' +
        '<a class="[^"]+" href="[^;]+;user_mac=((?:[a-zA-Z0-9]{2}(?:%3A)?){6})" title="下线"'
    const regx1 = new RegExp(regxs1, 'g')
    const regxs2 = '<tr(?:[^>]+)>' +
        '<td(?:[^>]+)>([^<]+)</td>' + // 套餐ID
        '<td(?:[^>]+)>([^<]+)</td>' + // 套餐名称
        '<td(?:[^>]+)>([^<]+)</td>' + // 购买时间
        '<td(?:[^>]+)>([^<]+)</td>' + // 有效期
        '<td(?:[^>]+)>([^<]+)</td>' + // 过期时间
        '<td(?:[^>]+)>' +
        '<button(?:[^>]+)>总流量：([^<]+)</button>' + // 总流量
        '<button(?:[^>]+)>可用流量：([^<]+)</button>' + // 可用流量
        '<button(?:[^>]+)>([^<]+)</button></td></tr>' // 百分比
    const regx2 = new RegExp(regxs2, 'g')
    return {
        device: [...str.matchAll(regx1)].map((e) => {
            return {
                ip: e[1],
                date: e[2],
                area: e[3],
                mac: e[4].replace(/%3A/g, ':')
            }
        }),
        liuliang: [...str.matchAll(regx2)].map((e) => {
            return {
                name: e[2],
                purchase_date: e[3],
                expiration_date: e[5],
                total: e[6],
                remain: e[7],
                percentage: e[8]
            }
        }),
        csrf: {
            parm: '',
            token: ''
        }
    }
}

function parse_mac_info(str) {
    const regxs1 = '<meta name="csrf-token" content="([^"]+)">'
    const regx1 = new RegExp(regxs1, 'g')
    const regxs2 = '<td data-col-seq="1">([^<]+)</td><td data-col-seq="2"><div(?:[^>]+)><button(?:[^>]+)>(?:<em>)?([^<]+)(?:</em>)?</button>'
    const regx2 = new RegExp(regxs2, 'g')
    return {
        "csrf_token": [...str.matchAll(regx1)][0][1],
        "mac_info": [...str.matchAll(regx2)].map((e) => ({
            "mac": e[1],
            "note": e[2]
        })).filter(e => e.note != "(未设置)")
    }
}