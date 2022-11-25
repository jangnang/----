const moment = require('moment')
const {EOL} = require('os')
const fs = require('fs')
const jwt = require('jsonwebtoken')
// 定义中间件 - 记录日志
function writeLog(req, res, next) {
    // 时间 + 客户端ip + 请求方式 + 请求路径 + 请求状态 ok/err + 换行
    let time = moment().format('YYYY-MM-DD HH:mm:ss')
    // console.log(req.ip);
    let ip = req.ip
    let method = req.method
    let uri = req.url
    let status = 'ok'
    let content = time + ' ' + ip + ' ' + method + ' ' + uri + ' ' + status
    // 先读取日志
    if(fs.existsSync('./logs/api.log')) {
        let log = fs.readFileSync('./logs/api.log', 'utf-8')
        // 写
        if(log) {
            fs.appendFile('./logs/api.log',  EOL + content, () => {})
        } else {
            fs.writeFile('./logs/api.log', content, () => {})
        }
    } else {
        fs.writeFile('../logs/api.log', content, () => {})
    }
    next()
}

function checkToken(req, res, next) {
    let responseObj = {
        errorCode: 0,
        msg: '成功'
    }
    let token = req.headers.authorization
    // 判断是否携带
    if(!token) {
        responseObj.errorCode = 401
        responseObj.msg = '令牌缺失'
        res.json(responseObj)
        return
    } else {
        // 验证令牌是否正确/是否有效
        let decodeObj
        try{
            decodeObj = jwt.verify(token, 'qwepiruxdcvjhioasdf')
            // 验证是否有效
            if(decodeObj.startTime + decodeObj.expires <= +new Date()) {
                responseObj.errorCode = 405
                responseObj.msg = '令牌过期'
                res.json(responseObj)
                return
            }  else {
                next()
            }
        } catch(err) {
            responseObj.errorCode = 402
            responseObj.msg = '令牌错误'
            res.json(responseObj)
            return
        }
        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImN1aWh1YSIsInN0YXJ0VGltZSI6MTY2MzgxMzg5Njk3NCwiZXhwaXJlcyI6NzIwMDAwMCwiaWF0IjoxNjYzODEzODk2fQ.L-QSlrE3Cdz9Idn-cPzaGMKjUxNZ1XDP6K9S4N5NoQY
        // console.log(222, decodeObj);
       
    }
}

module.exports = {
    writeLog,
    checkToken
}