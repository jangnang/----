// 操作mongodb
const mongoose = require('mongoose')

// 连接
mongoose.connect('mongodb://localhost:27017/api')

module.exports = mongoose