const express = require('express')
const router = express.Router()
const {register, login, info, userEdit, userPass} = require('../controller/user.js')
const {checkToken} = require('../middleware/middleware')
const upload = require('../config/upload')

// 注册
router.post('/api/register', register)

// 登录
router.post('/api/login', login)

// 获取用户信息
router.get('/api/info/:id', checkToken, info)

// 修改用户信息
router.put('/api/edit/:id', checkToken, upload.single('avatar'), userEdit)

// 修改用户密码
router.put('/api/pass/:id', checkToken, userPass)

module.exports = router