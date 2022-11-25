const fs = require('fs')
const path = require('path')
module.exports = (err) => {
    // 定义日志文件路径
    let logPath = path.join(__dirname, '../', 'logs', 'api.log')
    // 读取日志文件
    let log = fs.readFileSync(logPath, 'utf-8')
    // 将字符串结尾的ok换成新的内容
    log = log.replace(/ok$/, err)
    // 将新内容写入日志中
    fs.writeFile(logPath, log, () => {})
}