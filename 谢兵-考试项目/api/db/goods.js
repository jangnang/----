const mongoose = require('./connection')

// 创建schema
const schema = new mongoose.Schema({
    title: String,
    img_big_logo: String,
    img_small_logo: String,
    price: String,
    current_price: String,
    stock: Number,
    is_sale: Boolean,
    is_hot: Boolean,
    goods_introduce: String
})

// 创建model
module.exports = mongoose.model('good', schema)