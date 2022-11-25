// 导入
const express = require('express')
const userRouter = require('./routes/users')
const bodyParser = require('body-parser')
const writeLog = require('./middleware/writeLog')
const writeErrLog = require('./utils/writeErrLog')
const respond = require('./utils/respond')
const goodsRouter = require('./routes/goods')
const cartRouter = require('./routes/cart')
const cors = require('cors')

const app = express()
app.listen(3000)

// 允许跨域请求的中间件
app.use(cors({
    origin: 'http://localhost:8888'
}))
// 添加全局中间件 - 为了给后面所有请求都能使用的
app.use(bodyParser.urlencoded({extended: false}))
// 日志记录功能作为中间件
app.use(writeLog)

app.use('/uploads', express.static('uploads'))

// 处理注册请求 - 模块化处理
app.use('/api/users', userRouter)

// 处理商品请求
app.use('/api/goods', goodsRouter)

// 购物车
app.use('/api/cart', cartRouter)

// 测试错误日志写入
// app.get('/', (req, res) => {
//     // 手动抛出一个错误 - 我们希望这里能报错，但系统不报错，就可以手动报错 throw new Error('自定义错误信息')
//     throw new Error('自定义的错误')
//     res.send('okokok')
// })

// 404中间件
app.use((req, res, next) => {
    // 在日志中默认记录的请求成功ok，在这里应该做修改
    writeErrLog('路径不存在')
    // 响应比较友好的信息
    respond(res, 404, '请求路径错误')
})

// 异常处理中间件
app.use((err, req, res, next) => {
    // 在日志中默认记录的请求成功ok，在这里应该做修改
    writeErrLog(err)
    respond(res, 500, '服务器内部错误')
})
