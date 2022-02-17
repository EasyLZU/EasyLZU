module.exports = {
    "presets": [
        [
            "@vue/babel-preset-app",
            {
                "targets": {
                    "edge": "83",
                    "firefox": "78",
                    "chrome": "83",
                },
                "corejs": "3",
                "useBuiltIns": "usage",
            }
        ]
    ]
}