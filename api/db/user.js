const mongoose = require('./mongoose')

const schema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 4,
        maxlength: 10
    },
    password: String,
    tel: Number,
    email: String,
    nickname: String,
    avatar: String
})

const model = mongoose.model('user', schema, 'user')

module.exports = model