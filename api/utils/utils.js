const fs = require('fs')

// 封装写错误的函数
function writeErrLog(err) {
    // 读取
    let log = fs.readFileSync('./logs/api.log', 'utf-8')
    log = log.replace(/ok$/, err)
    // console.log(log);
    fs.writeFile('./logs/api.log', log, () => {})
}
// 响应信息的函数
function resinfo(res, errorCode, msg, data = null) {
    res.json({
        errorCode,
        msg,
        data
    })
}

// 深拷贝函数 - 除了_id都操作
function clone(data) {
    let newData
    if(typeof data != 'object' || !data) {
        return data
    }
    if(Object.prototype.toString.call(data) === '[object Array]') {
        newData = []
    } else {
        newData = {}
    }
    for(let key in data) {
        if(key != '_id') {
            if(typeof data[key] === 'object') {
                newData[key] = clone(data[key])
            } else {
                newData[key] = data[key]
            }
        }
    }
    return newData
}


module.exports = {
    writeErrLog,
    resinfo,
    clone
}