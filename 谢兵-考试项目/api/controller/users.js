const bcryptjs = require('bcryptjs')
const userModel = require('../db/users')
const respond = require('../utils/respond')
const jwt = require('jsonwebtoken')
const path = require('path')
module.exports = {
    // 注册
    register: (req, res) => {
        // 接收post数据
        let {username, password, email} = req.body
        // 所有数据都不能为空
        if(!username || !password || !email) {
            // 响应数据不能为空
            respond(res, 1, '数据不能为空')
            return // 阻止继续向下执行
        }
        // 到数据库中判读是否存在当前用户名
        // 到数据库中查询是否有条件为username的数据
        userModel.findOne({username}, (err, docs) => {
            // 判断是否有错误
            if(err) {
                respond(res, 2, '注册失败')
                return
            }
            // 判断是否查询到数据
            if(docs) {
                // 用户名被占用
                respond(res, 3, '用户名被占用')
                return
            }
            // 将数据添加到数据库
            userModel.insertMany([{username, password: bcryptjs.hashSync(password, 10), email}], (err, docs) => {
                if(err) {
                    respond(res, 2, '注册失败')
                    return
                }
                // 判断是否有插入的结果
                if(!docs.length) {
                    respond(res, 2, '注册失败')
                    return
                }
                respond(res, 0, '注册成功')
            })
        })
    },
    // 登录
    login: (req, res) => {
        // 接收post请求的数据
        let {username, password} = req.body
        // 验证数据
        if(!username || !password) {
            respond(res, 2, '数据不能为空')
            return
        }
        // 用username做条件查询数据中这个用户的数据
        userModel.findOne({username}, (err, docs) => {
            if(err) {
                respond(res, 2, '登录失败')
                return
            }
            // 是否查到数据
            if(!docs) {
                respond(res, 3, '账号或密码错误')
                return
            }
            // 查询到数据了 - 验证密码
            if(bcryptjs.compareSync(password, docs.password)) {
                // 令牌制造语法
                // jwt.sign(对象, 字符串)
                /*
                    令牌就类似于将一些简单的东西，通过特殊的算法进行排列组合，得出一个别人不容易看破的 - 加密
                */
                let token = jwt.sign({
                    username,
                    startTime: +new Date(),
                    expires: 7200*1000
                }, 'ASDFWETRRTYU$#^5kjfaklsdhfkjashf')
                respond(res, 0, '登录成功', {
                    // 颁发令牌 - jsonwebtoken - jwt
                    token: token,
                    userid: docs._id
                })
                return
            }
            respond(res, 3, '账号或密码错误')
        })
    },
    // 获取个人信息
    getUsers: (req, res) => {
 
        let {_id} = req.params
        // 对数据简单验证
        if(!_id) {
            respond(res, 2, '缺失用户id参数')
            return
        }
        // 根据_id到数据库中查询这个用户的所有信息
        userModel.findOne({_id}, {__v: 0, password: 0}, (err, docs) => {
            if(err) {
                respond(res, 2, '用户信息获取失败')
                return
            }
            // 判断是否有数据
            if(!docs) {
                respond(res, 2, '用户信息获取失败')
                return
            }
            // 验证是否是获取自己的信息
            if(req.tokenData.username != docs.username) {
                respond(res, 6, '不能获取别人的信息')
                return
            }
            docs.avatar = 'http://localhost:3000/' + docs.avatar
            // 给前端响应用户信息数据
            respond(res, 0, '用户信息获取成功', docs)
        })
    },
    // 修改用户信息
    editUser: async (req, res) => {
        // 从地址栏中获取用户id
        let {_id} = req.params
        // console.log(_id);
        // console.log( req.body );
        let {username, email} = req.body
        // console.log(req.file);
        // 组合文件路径
        let filePath = 'uploads/' + req.file.filename
        let docs = await userModel.updateOne({_id}, {
            username, 
            email,
            avatar: filePath
        })
        respond(res, 0, '修改成功')
    }
}