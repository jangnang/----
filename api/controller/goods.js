const goodsModel = require('../db/goods')
const {writeErrLog} = require('../utils/utils')
const {resinfo} = require('../utils/utils')
module.exports = {
    // 获取商品详情
    goodsDetail: async (req, res) => {
        let {id} = req.params
        let goodsDetail
        try{
            // 查询数据
            goodsDetail = await goodsModel.find({
                _id: id
            }, {__v: 0})
        } catch(err) {
            writeErrLog(err)
            res.json({
                errorCode: 10,
                msg: '请求错误，刷新重试！'
            })
            return
        }
        
        // 定义响应内容
        let responseObj = {
            errorCode: 0,
            msg: '详情数据获取成功',
            data: goodsDetail[0]
        }
        // 判断
        if(goodsDetail.length) {
            res.json(responseObj)
        } else {
            responseObj.errorCode = 1
            responseObj.msg = '详情数据获取失败'
            responseObj.data = null
            res.json(responseObj)
        }
    },
    // 列表页做分页的接口
    goodslist: async (req, res) => {
        let {page, pagesize} = req.params
        let total = await goodsModel.count()
        let totalPage = Math.ceil(total / pagesize)
        // 查询数据
        let goods = await goodsModel.find({}, {__v: 0}).skip((page - 1) * pagesize).limit(pagesize)
        resinfo(res, 0, '数据获取成功', {
            total,
            totalPage,
            pagesize,
            page,
            goods
        })
    },
    // 根据多个商品id获取商品信息
    cartGoods: async (req, res) => {
        // 获取post的数据
        let goodsids = req.body.goodsids
        // 将字符串转成数组
        try{
            goodsids = JSON.parse(goodsids)
        } catch(err) {
            resinfo(res, 1, '参数有误！')
            return
        }
        
        // 查询
        let goods
        try{
            goods = await goodsModel.find({_id: goodsids}, {__v: 0})
            resinfo(res, 0, '获取成功！', {
                goods
            })
        } catch(err) {
            resinfo(res, 2, '获取购物车商品失败！', {
                goods
            })
        }
        
        
    }
}