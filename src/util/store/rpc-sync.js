const browser = require("webextension-polyfill/dist/browser-polyfill")
import {
    RPCServer, RPCClient
} from "Util/rpc/rpc-base.js"

export function RPCSync(option) {
    return function (store) {
        const rpcServer = new RPCServer()
        const rpcClient = new RPCClient()
        browser.runtime.onConnect.addListener((port)=>{
            rpcServer.addPorts(port)
            rpcClient.addPorts(port)
            console.log(port)
        })
        rpcServer.listen()
        rpcServer.on('STATE_REQUIRE', async ()=>{
            return await rpcClient.call('UPDATE', {
                state: store.state[option.storeName]
            })
        })
        rpcServer.on('EMIT', async(parm)=>{
            return await store.dispatch(`${option.storeName}/${parm.actionName}`, parm.parms)
        })
        // store.registerModule(option.storeName, option.storeModule)
        store.subscribe((mutation, state) => {
            if (!mutation.type.startsWith(`${option.storeName}/`)) {
                return
            }
            const datas = state[option.storeName]
            console.log('推送根状态更新', JSON.stringify(datas))
            rpcClient.call('UPDATE', {
                state: datas
            })
        })
    }
}
export function RPCSyncClient(option) {
    if (!option || !option.storeName) {
        throw 'bad option'
    }
    return function (store) {
        console.log(store)
        // store.hotUpdate({
        //     mutations: {},
        //     actions: {

        //     }
        // })
        const port = browser.runtime.connect({name:"test"})
        const rpcServer = new RPCServer(port)
        const rpcClient = new RPCClient(port)
        for(const action in store[option.storeName].actions) {
            console.log('包装action')
            store[option.storeName].actions[action] = async(store, parms)=>{
                return await rpcClient.call('EMIT', {
                    actionName: action,
                    parms
                })
            }
        }
        // store.registerModule(option.storeName, option.storeModule)
        rpcServer.listen()
        rpcServer.on('UPDATE', async (data)=>{
            store.commit(`${option.storeName}/_RPCSync_Init`, data.state)
        })
        rpcClient.call('STATE_REQUIRE')
        store.subscribe((mutation) => {
            if (!mutation.type.startsWith(`${option.storeName}/`) || mutation.type == `${option.storeName}/_RPCSync_Init`) {
                return
            }
            console.warn('不应在RPC客户端提交mutation')
        })
    }
}