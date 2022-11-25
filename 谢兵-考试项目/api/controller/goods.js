const respond = require('../utils/respond')
const goodsModel = require('../db/goods')
module.exports = {
    // 查询所有商品数据
    getAllGoods: async (req, res) => {
        // 获取get请求的参数
        let {page, size} = req.params
        // 判断当前页不能为空
        if(!page) {
            respond(res, 1, '缺少当前页参数')
            return
        }
        // 根据page当前页获取当前页的数据
        let docs = await goodsModel.find({}, {__v: 0}, {skip: (page-1)*size, limit: size})
        if(!docs.length) {
            respond(res, 2, '获取商品数据失败')
            return
        }
        let total = await goodsModel.count()
        let totalPage = Math.ceil(total / size)
        // console.log(totalPage);
        respond(res, 0, '获取商品数据成功', {
            data: docs,
            totalPage
        })
    },
    goodsDetail: async (req, res) => {
        // 接收前端传递的id
        let {id} = req.params
        //从数据中获取一条数据
        let docs = await goodsModel.findOne({_id: id})
        if(!docs) {
            respond(res, 1, '获取失败')
            return
        }
        respond(res, 0, '获取成功', {
            data: docs
        })
    },   // 根据多个商品id获取商品信息
    cartGoods: async (req, res) => {
        // 获取post的数据
        let goodsids = req.body.goodsids
    
        // // 将字符串转成数组
        try{
            goodsids = JSON.parse(goodsids)
        //     console.log(goodsids);
        } catch(err) {
            respond(res, 1, '参数有误！')
            return
        }
        
        // 查询
        let goods
        try{
            goods = await goodsModel.find({_id: goodsids}, {__v: 0})
            respond(res, 0, '获取成功！', {
                goods
            })
        } catch(err) {
            respond(res, 2, '获取购物车商品失败！', {
                goods
            })
        }
        
        
    }
}
