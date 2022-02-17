export default function StoreSync(option) {
    if (!option || !option.storeName || !option.storeType) {
        throw 'bad option'
    }
    return function (store) {
        console.log(store)
        // store.registerModule(option.storeName, option.storeModule)
        const storedState = {}
        for (const k in store.state[option.storeName]) {
            storedState[k] = JSON.parse(localStorage.getItem(k))
        }
        console.log('初始化状态', storedState)
        switch (option.storeType) {
            case 'localStorage':
                store.commit(`${option.storeName}/_StoreSync_Init`, storedState)
                break
            default:
                console.error('错误的存储类别')
                break
        }
        store.subscribe((mutation, state) => {
            if (!mutation.type.startsWith(`${option.storeName}/` || mutation.type == `${option.storeName}/_StoreSync_Init`)) {
                return
            }
            const datas = state[option.storeName]
            console.log('持久化状态', JSON.stringify(datas))
            for (const k in datas) {
                switch (option.storeType) {
                    case 'localStorage':
                        localStorage.setItem(k, JSON.stringify(datas[k]))
                        break
                    default:
                        console.error('错误的存储类别')
                        break
                }
            }
        })
    }
}