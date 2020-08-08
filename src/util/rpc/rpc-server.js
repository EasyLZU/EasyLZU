browser.runtime.onConnect.addListener((p) => {
    if (p.name == 'rpc') {
        p.onMessage.addListener(function (req) {
            if (req['command'] == 'get_self_info') {
                get_self_info(req.msg).then((data) => {
                    p.postMessage(data)
                })
            }
        })
    }
})
async function get_self_info({
    username
}) {
    const response = await fetch('http://10.10.0.166:8800/site/sso?data=' + btoa(`${username}:${username}`))
    const body = await response.text()
    return parse_self_info(body)
}

function parse_self_info(str) {
    const regxs1 = '<td data-col-seq="1">([^<]+)</td><td data-col-seq="2">([^<]+)</td>' +
        '<td data-col-seq="5">([^<]+)</td><td class="[^"]+" style="[^"]+" data-col-seq="7">' +
        '<a class="[^"]+" href="[^;]+;user_mac=((?:[a-zA-Z0-9]{2}(?:%3A)?){6})" title="下线"'
    const regx1 = new RegExp(regxs1, 'g')
    const regxs2 = '<tr data-key="[^"]+"><td data-col-seq="1">([^<]+)</td>' +
        '<td data-col-seq="2">([^<]+)</td><td data-col-seq="5">' +
        '<button (?:[^>]+)>总流量：([^<]+)</button>' +
        '<button type="button" class="btn btn-xs btn-success" style="margin-right: 5px;">可用流量：([^<]+)</button>' +
        '<button type="button" class="btn btn-xs btn-success">([^<]+)</button></td></tr>'
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
                name: e[1],
                purchase_date: e[2],
                total: e[3],
                remain: e[4],
                percentage: e[5]
            }
        }),
        csrf: {
            parm: '',
            token: ''
        }
    }
}