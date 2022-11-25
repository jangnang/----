// 导入
const express = require('express')
const checkToken = require('../middleware/checkToken')
const {getAllGoods, goodsDetail,cartGoods} = require('../controller/goods')
// 创建路由对象
const router = express.Router()

// 处理获取商品信息的请求
router.get('/getAllGoods/:page/:size', getAllGoods)
router.get('/goodsDetail/:id', goodsDetail)
// 根据多个商品id获取商品数据
router.post('/cartgoods',checkToken, cartGoods)
// 导出路由对象
module.exports = router