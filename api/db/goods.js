const mongoose = require('./mongoose')

const schema = new mongoose.Schema({
    goodsname: String,
    goodsimg1: String,
    goodsimg2: String,
    goodsimg3: String,
})

const model = mongoose.model('good', schema)

module.exports = model