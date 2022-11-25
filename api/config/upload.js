const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../', '/uploads'))
    },
    filename: function (req, file, cb) {
        let extname = path.extname(file.originalname)
      cb(null, +new Date() + extname)
    }
})
  
const upload = multer({ storage: storage })
module.exports = upload