const express = require('express')
const app = express()
app.listen(3001)
const {createProxyMiddleware} = require('http-proxy-middleware')

const handlerProxy = createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true
})

app.use(express.static('src'))
app.use('/node_modules', express.static('node_modules'))

// 配置代理
// /users/api/register
app.use('/', (req, res) => {
    handlerProxy(req, res)
})