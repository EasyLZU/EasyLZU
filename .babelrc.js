module.exports = {
    "presets": [
        [
            "@babel/env",
            {
                "targets": {
                    "edge": "83",
                    "firefox": "78",
                    "chrome": "83",
                },
                "useBuiltIns": "usage",
            }
        ]
    ]
}