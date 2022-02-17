class omnibox {
    constructor() {
        // this.inputString = ''
        // browser.omnibox.onInputStarted.addListener(this._onInputStarted)
        // browser.omnibox.onInputChanged.addListener(this._onInputChanged)
        // browser.omnibox.onInputEntered.addListener(this._onInputEntered)
        // browser.omnibox.onInputCancelled.addListener(this._onInputCancelled)
    }
    _onInputStarted() {
        browser.omnibox.setDefaultSuggestion({
            description: '快速访问兰州大学相关网站'
        })
    }
    _onInputChanged(text, suggest) {
        suggest([{
            content: 'http://www.lzu.edu.cn',
            description: '兰州大学'
        },{
            content: 'http://www.lzu.edu.cn',
            description: text
        }])
    }
    _onInputEntered(text, disposition) {
        browser.tabs.create
        console.log(text, disposition)
    }
    _onInputCancelled() {
    }
}
new omnibox()