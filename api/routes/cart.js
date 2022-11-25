const express = require('express')
const router = express.Router()
const {checkToken} = require('../middleware/middleware')

const {cartAdd, cartList, changenumber, removeOne, removeAll, cartPay} = require('../controller/cart')

// router.use(checkToken)

// 添加购物车 - 必须在请求头携带令牌 - 键：Authorization  值：令牌字符串
router.post('/api/add', cartAdd)

// 获取购物车数据接口
router.get('/api/list/:id', cartList)

// 改变数量的接口
router.post('/api/changenumber', changenumber)

// 删除单个上平
router.post('/api/removeOne', removeOne)

// 删除当前用户的所有商品
router.get('/api/removeAll/:id', removeAll)

// 结算支付
router.post('/api/pay', cartPay)

module.exports = router