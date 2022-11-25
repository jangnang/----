const cartModel = require('../db/cart')
const respond = require('../utils/respond')
module.exports = {
    addcart: async (req, res) => {
        let {userid, goodsid, goodsnumber} = req.body
        // 存储到数据库
        // 判断数据库中是否有这个用户的这个商品
        let cartData = await cartModel.findOne({userid, goodsid})
        if(cartData) {
            await cartModel.updateOne({userid, goodsid}, {goodsnumber: cartData.goodsnumber+1})
            respond(res, 0, '添加成功')
        }  else {
            let docs = await cartModel.insertMany([{
                userid,
                goodsid,
                goodsnumber
            }])
            if(docs.length === 0) {
                respond(res, 1, '添加失败')
                return
            }
            respond(res, 0, '添加成功')
        }
        
    },
    // 获取购物车所有商品
    cartList: async (req, res) => {
        let {id} = req.params
        // 查询数据库
        let cartData
        try{
            cartData = await cartModel.find({
                userid: id
            }, {__v: 0})
        } catch(err) {
            writeErrLog(err)
            respond(res, 1, '购物车数据获取失败')
            return
        }
        if(cartData.length) {
            respond(res, 0, '购物车数据获取成功', cartData)
        } else {
            respond(res, 1, '购物车数据获取失败')
        }
    }, // 改变数量的接口
    changenumber: async (req, res) => {
        // 获取post数据
        let {num, userid, goodsid} = req.body
        // 根据userid和goodsid到数据库中修改这条数据
        try{
            await cartModel.updateOne({userid, goodsid}, {$set: {goodsnumber: +num}})
            respond(res, 0, '修改成功')
        }catch(err) {
            writeErrLog(err)
            respond(res, 1, '修改失败')
        }
    },
    // 删除单个商品
    removeOne: async (req, res) => {
        // 接收数据
        let {userid, goodsid} = req.body
        try{
            await cartModel.deleteOne({
                userid,
                goodsid
            })
            respond(res, 0, '删除成功')
        } catch(err) {
            writeErrLog(err)
            respond(res, 0, '删除失败')
        }
    },
    // 清空购物车
    removeAll: async (req, res) => {
        // 获取用户id
        let userid = req.params.id
        try{
            await cartModel.deleteMany({userid})
            respond(res, 0, '清空成功')
        } catch(err) {
            writeErrLog(err)
            respond(res, 1, '清空失败')
        }
    },
}