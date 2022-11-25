const mongoose = require('./mongoose')

const schema = new mongoose.Schema({
    goodsid: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    goodsnumber: {
        type: Number,
        required: true
    }
})

const model = mongoose.model('cart', schema, 'cart')

module.exports = model