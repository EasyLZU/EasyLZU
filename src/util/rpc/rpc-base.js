const browser = require("webextension-polyfill/dist/browser-polyfill")
export class RPCSyncServer {
    constructor(mutationsHander, actionsHander) {
        this.clientPorts = []
        browser.runtime.onConnect.addListener((p) => {
            if (p.name == 'RPCSync') {
                this.clientPorts.push(p)
                console.log('连接到客户端', p)
                p.onMessage.addListener(function (req) {
                    console.log('收到客户端RPCSync请求', req)
                    if (req['command'] == 'COMMIT_SYNC') {
                        mutationsHander({
                            commitModule: req.msg.module,
                            commitType: req.msg.type,
                            commitData: req.msg.data
                        }).then(((rvalue) => {
                            p.postMessage(rvalue)
                        }))
                    } else if (req['command'] == 'ACTION_REQ') {
                        actionsHander({
                            actionModule: req.msg.module,
                            actionType: req.msg.type,
                            actionData: req.msg.data
                        }).then(((rvalue) => {
                            p.postMessage(rvalue)
                        }))
                    }
                })
            }
        })
        console.log('RPCSync服务端开始侦听')
    }
    commitSync(msg) {
        for (const port of this.clientPorts) {
            port.postMessage({
                command: 'COMMIT_SYNC',
                msg
            })
        }
    }
}
export class RPCSyncClient {
    constructor() {
        this.port = browser.runtime.connect({
            name: 'RPCSync'
        })
    }
    commitSync(msg) {
        return new Promise((resolve, reject) => {
            this.port.onMessage.addListener(function (msg) {
                console.log('收到服务端RPCSync回应', msg)
                resolve(msg)
            })
            this.port.onDisconnect.addListener((p) => {
                reject(p)
            })
            console.log('向服务端发送RPCSync请求')
            this.port.postMessage({
                command: 'COMMIT_SYNC',
                msg
            })
        })
    }
}