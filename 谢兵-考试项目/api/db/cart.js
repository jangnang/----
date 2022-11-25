const mongoose = require('./connection')
const schema = new mongoose.Schema({
    userid: String,
    goodsid: String,
    goodsnumber: Number
})

module.exports = mongoose.model('cart', schema, 'cart')