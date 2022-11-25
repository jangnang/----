const express = require('express')
const {createProxyMiddleware} = require('http-proxy-middleware')

// 配置代理 - 第一个参数不加，默认就是要所以地址都可以进行代理
const proxy = createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true
})

const app = express()
app.listen(3001)

app.use(express.static('public'))

app.use((req, res) => {
    proxy(req, res)
})