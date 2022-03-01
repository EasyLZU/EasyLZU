const { distance } = require('fastest-levenshtein')

browser.omnibox.setDefaultSuggestion({
    description: "在百度搜索"
})

const urls = [
    {"name": "信息科学与工程学院", "url": "http://xxxy.lzu.edu.cn"},
    {"name": "网络安全与信息化办公室", "url": "http://its.lzu.edu.cn"},
    {"name": "个人工作台", "url": "http://my.lzu.edu.cn"},
    {"name": "邮箱", "url": "https://mail.lzu.edu.cn"},
    {"name": "校园网登录", "url": "http://login.lzu.edu.cn"},
    {"name": "校园一卡通", "url": "http://ecard.lzu.edu.cn"},
    {"name": "开源社区", "url": "http://oss.lzu.edu.cn"},
    {"name": "镜像站", "url": "http://mirrors.lzu.edu.cn"},
    {"name": "教务处", "url": "http://jwc.lzu.edu.cn"},
    {"name": "教务系统", "url": "http://jwk.lzu.edu.cn"}
]

browser.omnibox.onInputChanged.addListener((text, suggest) => {
    const url_list = urls.map(e => ({
        name: e.name,
        distance: distance(text, e.name),
        url: e.url
    })).sort((a, b) => a.distance - b.distance).slice(0, 5)
    suggest(url_list.map(e => ({
        content: e.url,
        description: e.name
    })))
})

browser.omnibox.onInputEntered.addListener((text, disposition) => {
    let url = "about:black"
    if (!text.startsWith("http://")) {
        const wd = new URLSearchParams({
            wd: "兰州大学 " + text
        })
        url = "https://www.baidu.com/baidu?" + wd.toString()
    } else {
        url = text
    }
    switch (disposition) {
        case "currentTab":
            browser.tabs.update({url})
            break
        case "newForegroundTab":
            browser.tabs.create({url})
            break
        case "newBackgroundTab":
            browser.tabs.create({url, active: false})
            break
        default:
            return
    }
})
