const respond = require('../utils/respond')
const jwt = require('jsonwebtoken')
const writeErrLog = require('../utils/writeErrLog')
module.exports = (req, res, next) => {
    if(!req.headers.authorization) {
        respond(res, 3, '缺少令牌！')
        return
    }
    let tokenData
    try{
        tokenData = jwt.verify(req.headers.authorization, 'ASDFWETRRTYU$#^5kjfaklsdhfkjashf');
    } catch(err) {
        writeErrLog(err)
        respond(res, 4, '令牌是错误的')
        return
    }
    if(tokenData.startTime + tokenData.expires < +new Date()) {
        respond(res, 5, '令牌过期了')
        return
    }
    // 将解开的tokenData放在req上
    req.tokenData = tokenData
    next()
}