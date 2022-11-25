const cartModel = require('../db/cart')
const {resinfo} = require('../utils/utils')
const {writeErrLog} = require('../utils/utils')
const AlipaySdk = require('alipay-sdk').default
const fs = require('fs')

module.exports = {
    // 添加购物车
    cartAdd: async (req, res) => {
        let {goodsid, userid, goodsnumber} = req.body
        // 判断数据是否接受到
        if(!goodsid || !userid || !goodsnumber) {
            resinfo(res, 1, '缺失参数')
            return
        }
        let data
        try{
            // 根据商品id和用户id查询是否有数据
            data = await cartModel.find({
                goodsid,
                userid
            })
        } catch(err) {
            writeErrLog(err)
        }
        // 判断是否查到
        if(!data.length){
            let insertResult
            try{
                // 添加到数据库
                insertResult = await cartModel.insertMany({
                    goodsid,
                    userid,
                    goodsnumber
                })
            } catch(err) {
                writeErrLog(err)
            }
            // 判断
            if(insertResult.length) {
                resinfo(res, 0, '添加购物车成功！')
            } else {
                resinfo(res, 2, '购物车添加失败！')
            }
            return
        }
        // 修改数量
        let updateResult
        try{
            updateResult = await cartModel.updateOne({
                goodsid,
                userid
            }, {$set: {
                goodsnumber: +data[0].goodsnumber + +goodsnumber
            }})
        } catch(err) {
            writeErrLog(err)
        }
        // 判断修改结果
        if(updateResult) {
            resinfo(res, 0, '添加购物车成功！')
        } else {
            resinfo(res, 2, '购物车添加失败！')
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
            resinfo(res, 1, '购物车数据获取失败')
            return
        }
        if(cartData.length) {
            resinfo(res, 0, '购物车数据获取成功', cartData)
        } else {
            resinfo(res, 1, '购物车数据获取失败')
        }
    },
    // 改变数量的接口
    changenumber: async (req, res) => {
        // 获取post数据
        let {num, userid, goodsid} = req.body
        // 根据userid和goodsid到数据库中修改这条数据
        try{
            await cartModel.updateOne({userid, goodsid}, {$set: {goodsnumber: +num}})
            resinfo(res, 0, '修改成功')
        }catch(err) {
            writeErrLog(err)
            resinfo(res, 1, '修改失败')
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
            resinfo(res, 0, '删除成功')
        } catch(err) {
            writeErrLog(err)
            resinfo(res, 0, '删除失败')
        }
    },
    // 清空购物车
    removeAll: async (req, res) => {
        // 获取用户id
        let userid = req.params.id
        try{
            await cartModel.deleteMany({userid})
            resinfo(res, 0, '清空成功')
        } catch(err) {
            writeErrLog(err)
            resinfo(res, 1, '清空失败')
        }
    },
    cartPay: async (req, res) => {
          const alipaySdk =  new  AlipaySdk({
            appId: '2021003155628371', // 开放平台上创建应用时生成的 appId
            signType: 'RSA2', // 签名算法,默认 RSA2
            gateway: 'https://openapi.alipaydev.com/gateway.do', // 支付宝网关地址 ，沙箱环境下使用时需要修改
            alipayPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3JwkSXXLe9gRLyZ2V6IqcHwkTZYtUdnQMTbsVJWi6ETUubKmU3D69ySAy8k1X5wX0stAa6GvGI0dweFNoQOVixtSHd4LdPYZsMg8ls0Cj1Go9TvfPRTd6fryMWTOnMmuC/LD/Lw/0H0efH1g7yNODWIhg1s+bixUYG9C/NJY21ev3vE0gbjPJJjDO0q2IkhbGqo+z9ypMVw878JOUeRnNKe4PlBEsyFSNIx3rKonDsL3Ov1M9okLcrRyh3vOBFSMvqG59TdpqW8ERSvXyrB7fu1Dh0tgDPZXjKTOfBTkn9tm1PA5kCs/K6liN+pMWBiIS+zq5JK4xhAHUCoI43wYzwIDAQAB', // 支付宝公钥，需要对结果验签时候必填
            privateKey: 'MIIEpQIBAAKCAQEA3JwkSXXLe9gRLyZ2V6IqcHwkTZYtUdnQMTbsVJWi6ETUubKmU3D69ySAy8k1X5wX0stAa6GvGI0dweFNoQOVixtSHd4LdPYZsMg8ls0Cj1Go9TvfPRTd6fryMWTOnMmuC/LD/Lw/0H0efH1g7yNODWIhg1s+bixUYG9C/NJY21ev3vE0gbjPJJjDO0q2IkhbGqo+z9ypMVw878JOUeRnNKe4PlBEsyFSNIx3rKonDsL3Ov1M9okLcrRyh3vOBFSMvqG59TdpqW8ERSvXyrB7fu1Dh0tgDPZXjKTOfBTkn9tm1PA5kCs/K6liN+pMWBiIS+zq5JK4xhAHUCoI43wYzwIDAQABAoIBACkYLOpCNxVquki+MW1BmAY8GccaIncMy+te/8cB2MbLi5TL4o/Ii/ddpWBQqtCUkxuBIQ7rn2JDZzemcH99221+OV227wtqjH6RzjeJGOD5pS+JZ5xJNs1PIa5xyMsMBo/TOQ7rQjfkFrm54USqnu9/SB7f8FE1kMIl96SAymyRIFZ/k6a1cJc9OEgc7/G0bPbXAEONaPpDXDnQQDPkPivS4FCpLmjJz6MSYDJsHXAFM7Qc2Qz7rB+AB+251p7vi/p4Ej4gub3/hIeNrDwcT/vzU5gnqNsh9qrTeUejn8znf3Km0M6Av4BTiWNFvUunwqXtHt4BSb82t48CLwTVrwECgYEA+vMKkdmEvqzWAT46zjL6/6AZfmr6w3ycq8spZCfo15QaY/4JtVI7JnfIB56vzpoCaJ+rtgk8QGwGX/y/JK18A7+rscrBmWc2MMZ3NeMRA7D/qupv87gvLJBAVK1xSL8IIJBWA42bwRJD3vME4mDdaaWrh/UQGBY5OiJiE1IWFPkCgYEA4QzIj7x6tJsJOf31kRBtQmoKuyPXO8XvvtUnTLgmIOeo7CqadYCZ1OdV+91nuiw5mdGpOBrU0oI7K2rTYrJQFgnyvuScO6au4Bipex12R/zUxwJIcfn2GkcAEeYwtLIJCKfIxoGwakf4RAyMJ4EFzthAnWr6PrSGzmadY85dNgcCgYEArDYJNNmevPMC0UuRM1vM34tQs25as7haE5KRzweMRBSAn8n/g4zwxo9Al+oQH6mUqZOZVIy16ke3gDuEOHlNN41bF+FaRhmMGKC5wiMW0/+tE+9Z8FifFufPHc0AhrmBrEcgn8OX9UDBjsgau/dZOlzUf7Ju3vixQPHDeBrGyJECgYEAm02hEl/1JbFfmp+A2UzGuXBIW4CORXeAzOZ3ql/iIA796Yw07yWCAwRpt9fAfx+J2HZxGoCZoXOxtXKQ0alPzwWqeMV2c0vBnnAmdQmN2HvHslYG/HCMvvGEQNXjgq7hwRFYYnSY858a2or2JUTKZ0WgwYFTk/YsmT8DGh8M//0CgYEAwgsl77QWsZAof33FbA/FnSVbuqqzYLCKj6v158IVHbWm5LxF5v/9Caja4Cm7C0s8vKjJu+LigPTDgBBlnlZkqAbBaZOjFi1sSxmfJB93gUuFzNRo6irOIOlsyPagV2jWOGA1twTD/t19MB/RcLnf5KC1BAJUb05kO0FFujkRRIw=', // 应用私钥字符串
          });
          let orderId='ASDFASDFasdfasdf'
        // * 添加购物车支付支付宝 */
        // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
        const formData = new AlipaySdk();
        formData.setMethod('get');
        // 通过 addField 增加参数
        // 在用户支付完成之后，支付宝服务器会根据传入的 notify_url，以 POST 请求的形式将支付结果作为参数通知到商户系统。
        formData.addField('notifyUrl', 'https://www.xuexiluxian.cn'); // 支付成功回调地址，必须为可以直接访问的地址，不能带参数
        formData.addField('bizContent', {
            outTradeNo: orderId, // 商户订单号,64个字符以内、可包含字母、数字、下划线,且不能重复
            productCode: 'FAST_INSTANT_TRADE_PAY', // 销售产品码，与支付宝签约的产品码名称,仅支持FAST_INSTANT_TRADE_PAY
            totalAmount: '0.01', // 订单总金额，单位为元，精确到小数点后两位
            subject: '商品', // 订单标题
            body: '商品详情', // 订单描述

        });
        formData.addField('returnUrl', 'https://opendocs.alipay.com');//加在这里才有效果,不是加在bizContent 里面
        // 如果需要支付后跳转到商户界面，可以增加属性"returnUrl"
        const result =  alipaySdk.exec(  // result 为可以跳转到支付链接的 url
            'alipay.trade.page.pay', // 统一收单下单并支付页面接口
            {}, // api 请求的参数（包含“公共请求参数”和“业务参数”）
            { formData: formData },
        );
        result.then((resp)=>{
            res.send(
                {
                    "success": true,
                    "message": "success",
                    "code": 200,
                    "timestamp": (new Date()).getTime(),
                    "result": resp
                }
            )
        })
    }
}