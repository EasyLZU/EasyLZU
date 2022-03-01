const browser = require("webextension-polyfill/dist/browser-polyfill")

browser.runtime.onConnect.addListener((p) => {
    if (p.name == 'rpc') {
        p.onMessage.addListener(function (req) {
            if (req['command'] == 'get_self_info') {
                get_self_info(req.msg).then((data) => {
                    p.postMessage(data)
                })
            }
        })
    }else if(p.name == 'RPCSync') {
        p.onMessage.addListener(function (req) {
            console.log('收到子节点RPCSync请求', req)
        })
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
    console.log(str.matchAll(regx2))
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