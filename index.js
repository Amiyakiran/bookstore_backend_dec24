//import dotenv file
require('dotenv').config()//load environment
//import express library
const express = require('express')
//import cors 
const cors = require('cors')
//import route 
const route = require('./routes')
//import db connection file
require('./databaseconnection')

//import application specific middleware
// const appMiddleware = require('./middleware/appMiddleware')

//create the server - express()
const bookstoreServer = express()

//server using cors 
bookstoreServer.use(cors())
bookstoreServer.use(express.json()) // parse json - middleware
// bookstoreServer.use(appMiddleware)
bookstoreServer.use(route)
//export the uploads folder from the server side 
bookstoreServer.use('/upload', express.static('./uploads'))
//export the pdfuploads folder from the server side 
bookstoreServer.use('/pdfUploads', express.static('./pdfUploads'))


//create port 
PORT = 4000 || process.env.PORT


bookstoreServer.listen(PORT ,  ()=>{
    console.log(`server running successfully at port number ${PORT}`);
    
})
