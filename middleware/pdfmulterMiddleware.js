//import multer
const multer = require('multer')


const storage = multer.diskStorage({
    //path to store the file
    destination:(req, file , callback)=>{
        callback(null,'./pdfUploads')
    },
    //name in which file is stored
    filename:(req, file, callback)=>{
       const fname = `resume-${file.originalname}`
       callback(null , fname)
    }
})


const fileFilter =  (req, file , callback)=>{
    //accepts only png jpg , jpeg
    if(file.mimetype == 'application/pdf'){
        callback(null , true)
    }
    else{
        callback(null, false)
        return callback(new Error('accept only pdf files'))
    }

}

//create config

const pdfmulterConfig =  multer({
    storage,
    fileFilter
})

module.exports = pdfmulterConfig