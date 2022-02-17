class RPCBase {
    constructor(ports) {
        this.ports = new Set()
        this.timeout = 10000
        this.waitBuffer = new Map()
        this.listeners = new Map()
        this.addPorts(ports)
    }
    addPorts(ports) {
        if(!ports) {
            return
        } else if(ports instanceof Array) {
            for(const port of ports) {
                this._postListen(port)
                this.ports.add(port)
            }
        } else {
            this._postListen(ports)
            this.ports.add(ports)
        }
    }
    _postListen(port) {
        port.onMessage.addListener((req)=>{
            const {type, sessionID} = req
            if(sessionID) { //通知wait
                if(this.waitBuffer.has(sessionID)) {
                    const resolve = this.waitBuffer.get(sessionID)
                    this.waitBuffer.delete(sessionID)
                    resolve(req)
                }
            }
            if(type && sessionID && this.listeners.has(type)) { //通知listener
                for(const listener of this.listeners.get(type)) {
                    listener(req)
                }
            }
        })
    }
    _wait(sessionID, autoTimeout) { //async
        return new Promise((resolve)=>{
            if(autoTimeout) {
                const watchCat = setTimeout(()=>{
                    resolve({
                        type: 'RPC_RESPONSE',
                        sessionID,
                        msg: {
                            err: true,
                            msg: "请求超时"
                        }
                    })
                }, this.timeout)
                this.waitBuffer.set(sessionID, (req)=>{
                    clearTimeout(watchCat)
                    resolve(req)
                })
            } else {
                this.waitBuffer.set(sessionID, (req)=>{
                    resolve(req)
                })
            }
        })
    }
    _listen(type, callback) {
        if(!this.listeners.has(type)) {
            this.listeners.set(type, [])
        }
        this.listeners.get(type).push(callback)
    }
    _send(req) {
        for(const port of this.ports) {
            try {
                port.postMessage(req)
            } catch (error) {
                console.warn('端口失效, 移除', JSON.stringify(port))
                this.ports.delete(port)
            }
        }
    }
    _guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=>{
            const r = Math.random()*16 | 0
            const v = c == 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }
}
export class RPCServer extends RPCBase{
    constructor(ports) {
        super(ports)
        this.listeners = new Map()
    }
    listen() {
        this._listen('RPC_CALL', (req)=>{
            // console.log('收到CALL', req)
            if(this.listeners.has(req.msg.func)) {
                this.listeners.get(req.msg.func)(req.msg.parm).then((result)=>{
                    this._send({
                        type: 'RPC_RESPONSE',
                        sessionID: req.sessionID,
                        msg: {
                            err: false,
                            msg: result
                        }
                    })
                })
            } else {
                this._send({
                    type: 'RPC_RESPONSE',
                    sessionID: req.sessionID,
                    msg: {
                        err: true,
                        msg: "func未找到"
                    }
                })
            }
        })
    }
    on(funcName, func) {
        this.listeners.set(funcName, func)
    }
}
export class RPCClient extends RPCBase {
    constructor(ports) {
        super(ports)
    }
    async call(func, parm, autoTimeout) {
        const sessionID = this._guid()
        this._send({
            type: 'RPC_CALL',
            sessionID,
            msg: {
                func,
                parm
            }
        })
        const result =  await this._wait(sessionID, autoTimeout)
        // console.log("收到回复", result)
        if(result.type == 'RPC_RESPONSE') {
            if(result.msg.err) {
                throw result.msg.msg
            } else {
                return result.msg.msg
            }
        } else {
            throw "RPC协议错误"
        }
    }
}