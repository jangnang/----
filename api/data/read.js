const fs = require('fs')
let goodsname = fs.readFileSync('./goodsname.txt', 'utf-8')
goodsname = goodsname.split('----------')
// console.log(goodsname);

let goodsimg1 = fs.readFileSync('./goodsimg1.txt', 'utf-8')
goodsimg1 = goodsimg1.split('----------')
// console.log(goodsimg1);

let goodsimg2 = fs.readFileSync('./goodsimg2.txt', 'utf-8')
goodsimg2 = goodsimg2.split('----------')
// console.log(goodsimg2);

let goodsimg3 = fs.readFileSync('./goodsimg3.txt', 'utf-8')
goodsimg3 = goodsimg3.split('----------')
// console.log(goodsimg3);

var arr = []
goodsname.forEach((item, index) => {
    var obj = {
        goodsname: item,
        goodsimg1: goodsimg1[index],
        goodsimg2: goodsimg2[index],
        goodsimg3: goodsimg3[index],
        
    }
    arr.push(obj)
}) 

const mongoose = require('../db/mongoose')
const goodsSchema = new mongoose.Schema({
    goodsname: String,
    goodsimg1: String,
    goodsimg2: String,
    goodsimg3: String
})
const goodsModel = mongoose.model('good', goodsSchema)

goodsModel.insertMany(arr).then(res => {
    console.log(res)
})