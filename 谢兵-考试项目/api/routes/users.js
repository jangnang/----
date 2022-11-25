// 导入
const express = require('express')
const {register, login, getUsers, editUser} = require('../controller/users')
const checkToken = require('../middleware/checkToken')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../', 'uploads'))
    },
    filename: function (req, file, cb) {
        let extname = path.extname(file.originalname)
        let time = +new Date()
        let str = 'abcdefghijklmnopqrstuvwxyz0123456789'
        let random = ''
        for(let a=0; a<6;a++) {
            random += str[ Math.floor(Math.random() * str.length) ]
        }
        // cb(null, 文件名称)
        cb(null, time + random + extname)
    }
})
  
const upload = multer({ storage: storage })

// 创建路由对象
const router = express.Router()

// 处理注册请求
router.post('/register', register)

// 处理登录请求
router.post('/login', login)

// 处理用户信息获取的请求
router.get('/getUsers/:_id', checkToken, getUsers)

// 修改用户信息
router.put('/editUser/:_id', checkToken, upload.single('avatar'), editUser)


// 导出路由对象
module.exports = router