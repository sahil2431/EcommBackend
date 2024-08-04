const multer = require('multer')



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
      console.log("file")
      
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
      console.log(file.originalname , file.destination)
    }
  })
  

  const upload = multer({ storage: storage })
module.exports= {upload}