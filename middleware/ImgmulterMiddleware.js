//import multer
const multer = require('multer')


const storage = multer.diskStorage({
    //path to store the file
    destination:(req, file , callback)=>{
        callback(null,'./uploads')
    },
    //name in which file is stored
    filename:(req, file, callback)=>{
       const fname = `image-${file.originalname}`
       callback(null , fname)
    }
})


const fileFilter =  (req, file , callback)=>{
    //accepts only png jpg , jpeg
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'){
        callback(null , true)
    }
    else{
        callback(null, false)
        return callback(new Error('accept only png , jpg, jpeg files'))
    }

}

//create config

const multerConfig =  multer({
    storage,
    fileFilter
})

module.exports = multerConfig