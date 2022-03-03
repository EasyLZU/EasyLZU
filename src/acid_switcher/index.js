const browser = require("webextension-polyfill/dist/browser-polyfill")

const js = document.createElement("script")
js.src = browser.runtime.getURL("ACIDPayLoad.js")
document.body.appendChild(js)
