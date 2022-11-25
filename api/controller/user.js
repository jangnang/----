const userModel = require('../db/user')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {resinfo, writeErrLog, clone} = require('../utils/utils')
const path = require('path')

module.exports = {
    // 用户注册
    register: async (req, res) => {
        let {username, password, tel, email} = req.body
        // 验证必填
        if(username === '' || password === '' || tel === '' || email === '') {
            resinfo(res, 1, '参数不能为空')
            return
        };
        try{
            // 查询用户名
            var res1 = await userModel.find({username})
        } catch(err) {
            writeErrLog(err)
            resinfo(res, 2, '注册失败，请刷新后重试！')
            return
        }
        if(res1.length) {
            resinfo(res, 3, '用户名被占用！')
            return
        };
        let res2
        try{
            res2 = await userModel.insertMany({
                username,
                password: bcryptjs.hashSync(password, 10),
                email,
                tel
            });
        } catch(err) {
            writeErrLog(err)
            resinfo(res, 2, '注册失败，请刷新后重试！')
            return
        }
        if(res2.length) {
            resinfo(res, 0, '注册成功！')
        } else {
            resinfo(res, 2, '注册失败，请刷新后重试！')
        }
    },
    // 用户登录
    login: async (req, res) => {
        // 账号的键：username  密码的键：password
        let {username, password} = req.body
        // console.log(111, username, password);
        // 验证数据不能为空
        if(!username || !password) {
            resinfo(res, 1, '参数不能为空！')
            return
        }
        let userInfo 
        try{
            // 数据库查询用户信息 - 根据用户做条件
            userInfo = await userModel.findOne({username})
        } catch(err) {
            writeErrLog(err)
            resinfo(res, 3, '用户名或密码错误')
            return
        }
        // 判断是否查询到
        if(!userInfo) {
            resinfo(res, 2, '用户名不存在')
            return
        }
        // 验证密码是否正确
        let bool = bcryptjs.compareSync(password, userInfo.password)
        // 判断验证是否通过
        if(bool) {
            // 颁发令牌 - 创建令牌 - 依赖第三方模块 - jwt：jsonwebtoken
            let token = jwt.sign({
                username: userInfo.username,
                startTime: +new Date(),
                expires: 7200 * 1000
            }, 'qwepiruxdcvjhioasdf')
            resinfo(res, 0, '登录成功', {token, userid: userInfo._id})
            return
        } else {
            resinfo(res, 3, '用户名或密码错误')
            return
        }
    },
    // 用户信息获取
    info: async (req, res) => {
        // 获取传递的用户id
        let userid = req.params.id
        // 查询
        let userInfo
        try{
            userInfo = await userModel.findOne({_id: userid}, {__v: 0})
        } catch(err) {
            writeErrLog(err)
            resinfo(res, 1, '用户信息获取失败！')
            return
        }
        if(!userInfo) {
            resinfo(res, 1, '用户信息获取失败！')
            return
        }
        info = JSON.parse(JSON.stringify(userInfo))
        delete info.password
        // info.avatar = path.join(__dirname, '../', info.avatar)
        resinfo(res, 0, '用户信息获取成功！', {info})
    },
    // 用户信息修改
    userEdit: async (req, res) => {
        // console.log(req.file);
        // 获取用户id
        let userid = req.params.id
        // console.log(userid);
        // 接收请求主体
        let {username, tel, email, nickname} = req.body
        if(username === '' && tel === '' && email === '') {
            resinfo(res, 1, '参数不能为空！')
            return
        }
        // 修改
        try{
            await userModel.updateOne({_id: userid}, {$set: {
                username, tel, email,
                nickname,
                avatar: 'uploads/' + req.file.filename
            }})
            resinfo(res, 0, '用户信息修改成功！')
        } catch(err) {
            writeErrLog(err)
            resinfo(res, 2, '用户信息修改失败！')
        }
    },
    // 用户密码修改
    userPass: async (req, res) => {
        // 接收id
        let userid = req.params.id
        // 接收密码
        let {oldpass, newpass} = req.body
        // 判断是否为空
        if(oldpass === '' || newpass === '') {
            resinfo(res, 1, '参数不能为空！')
            return
        }
        // 验证旧密码
        // 根据用户id查询用户信息
        let userData
        try{
            userData = await userModel.findOne({
                _id: userid
            })
        } catch(err) {
            writeErrLog(err)
            resinfo(res, 2, '用户id有误！')
            return
        }
        if(!userData) {
            resinfo(res, 2, '用户id有误！')
            return
        }
        // 验证旧密码
        let bool = bcryptjs.compareSync(oldpass, userData.password)
        // 判断旧密码
        if(!bool) {
            resinfo(res, 3, '旧密码错误！')
            return
        }
        // 改密码
        try{
            await userModel.updateOne({
                _id: userid
            }, {$set: {
                password: bcryptjs.hashSync(newpass, 10)
            }})
        } catch(err) {
            writeErrLog(err)
            resinfo(res, 4, '用户密码修改失败！')
            return
        }
        resinfo(res, 0, '用户密码修改成功')
    }
}
