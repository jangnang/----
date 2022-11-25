const express = require('express')
const router = express.Router()
const {checkToken} = require('../middleware/middleware')
const {goodsDetail, goodslist, cartGoods} = require('../controller/goods')


// 列表页做分页的商品数据接口
router.get('/api/goodslist/:page/:pagesize', goodslist)

// 一个商品数据
router.get('/api/detail/:id', goodsDetail)

// 根据多个商品id获取商品数据
router.post('/api/cartgoods', checkToken, cartGoods)

module.exports = router