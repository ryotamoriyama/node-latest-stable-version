#!/usr/bin/env node
'use strict'
let https = require('https')
const {execSync} = require('child_process')

const URL = 'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json'

let stable = new Promise((resolve) => {
    https.get(URL, function (res) {
        let body = ''
        let ltsVer = ''
        let latestVer = ''
        res.setEncoding('utf8')

        res.on('data', (chunk) => {
            body += chunk
        })

        res.on('end', (res) => {
            res = JSON.parse(body)
            Object.keys(res).forEach(function (ver) {
                if (res[ver].codename !== undefined && res[ver].codename !== "") ltsVer = ver
            })
            const stable = execSync('npm info node@' + ltsVer + ' version').toString().split("\n")
            Object.keys(stable).forEach(function (line) {
                if (stable[line] !== "") latestVer = stable[line]
            })
            resolve(latestVer.replace(/^.+?'([\d.]+?)'$/, '$1'))
        })
    })
})

module.exports = stable