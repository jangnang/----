const express = require('express')
const router = express.Router()

const {addcart,cartList,changenumber,removeOne,removeAll} = require('../controller/cart.js')

router.post('/addcart', addcart)
router.get('/cartList/:id', cartList)
// 改变数量的接口
router.post('/changenumber', changenumber)

// 删除单个上平
router.post('/removeOne', removeOne)

// 删除当前用户的所有商品
router.get('/removeAll/:id', removeAll)

module.exports = router