const retryMsg = "INFOError锛宔rrCode=2"
const nowACID = $('#ac_id').val()

const realLogin = $.Login
$.Login = function (url, data, callback) {
    const realCallback = callback
    const rawData = JSON.parse(JSON.stringify(data))
    realLogin(url, data, (callbackData) => {
        if (callbackData.error != "ok" && callbackData.message == retryMsg) {
            // realCallback(callbackData)
            // try again
            const nextID = data.ac_id == "1" ? "2" : "1"
            rawData.ac_id = nextID
            layer.msg("EasyLZU正在为您智能登录，请稍后...", {
                anim: 0,
                time: 2000
            }, () => {
                realLogin(url, rawData, (nextData) => {
                    realCallback(nextData)
                })
            }
            )
            return
        }
        realCallback(callbackData)
    })
}