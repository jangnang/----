const moment = require('moment')
const path = require('path')
const fs = require('fs')
const {EOL} = require('os')
module.exports = (req, res, next) => {
    // 准备要记录的数据 - 格式化某个指定格式的时间日期利用第三方模块 - moment
    let time = moment().format('YYYY-MM-DD HH:mm:ss')
    let ip = req.connection.remoteAddress
    let method = req.method
    let uri = req.url
    let status = 'ok' // 默认都是ok成功的
    let content = time + ' ' + ip + ' ' + method + ' ' + uri + ' ' + status
    // 定义日志文件路径
    let logPath = path.join(__dirname, '../','logs', 'api.log')
    // 判断文件是否存在
    if(fs.existsSync(logPath)) {
        // 读取
        let data = fs.readFileSync(logPath, 'utf-8')
        // 是否有内容
        if(data) {
            // 追加
            fs.appendFileSync(logPath, EOL + content)
            next()
            return
        }
    }
    fs.writeFileSync(logPath, content)
    next()
}