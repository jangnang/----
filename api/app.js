const express = require('express')
const app = express()
app.listen(3000)
const userRouter = require('./routes/user')
const goodsRouter = require('./routes/goods')
const cartRouter = require('./routes/cart')
const bodyParser = require('body-parser')
const {writeErrLog} = require('./utils/utils')
const {writeLog} = require('./middleware/middleware')


// 全局的写日志的中间件
app.use(writeLog)

// 获取post数据的中间件
app.use(bodyParser.urlencoded({extended: false}))

// 静态资源托管
// app.use(express.static('public'))
// app.use('/node_modules', express.static('node_modules'))

app.use('/uploads', express.static('uploads'))

/*
注册：/users/api/register - post
登录：/users/api/login - post
查询用户信息：/users/api/info - get
用户信息修改：/users/api/edit - put
用户密码修改：/users/api/pass - put
*/
app.use('/users', userRouter)

/*
首页数据查询：/goods/api/list - get
详情页数据：/goods/api/detail - get
*/
app.use('/goods', goodsRouter)

/*
添加购物车接口：/cart/api/add - post
获取购物车商品接口：/cart/api/list - get
购物车结算支付：/cart/api/pay
*/
app.use('/cart', cartRouter)

/*

*/

// 错误处理中间件
app.use((err, req, res, next) => {
    // 将错误信息存起来 - 日志
    writeErrLog(err)
    
    // 给用户响应一个信息
    res.json({
        errorCode: 10,
        msg: '请求错误，刷新重试！'
    })
})

// 404处理中间件
app.use((req, res, next) => {
    // 将错误信息存起来 - 日志
    writeErrLog('404-路径不合法')
    // 给用户响应一个信息
    res.json({
        errorCode: 404,
        msg: '路径不合法！'
    })
})