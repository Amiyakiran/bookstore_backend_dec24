const users = require("../model/userModel");
const jwt = require('jsonwebtoken')



//register
exports.registerController = async (req, res) => {
   //logic
   const { username, email, password } = req.body
   console.log(username, email, password);

   try {
      const existingUser = await users.findOne({ email })

      if (existingUser) {
         res.status(409).json('Already user Exist')
      }
      else {
         const newUser = new users({
            username,
            email,
            password,
         })
         await newUser.save()//mongodb save 
         res.status(200).json(newUser)
      }

   } catch (error) {
      res.status(500).json(error)
   }

}

//login
exports.loginController = async (req, res) => {
   const { email, password } = req.body
   console.log(email, password);
   try {

      const existingUser = await users.findOne({ email })
      if (existingUser) {
         if (existingUser.password == password) {
            const token = jwt.sign({ userMail: existingUser.email }, 'secretkey')
            res.status(200).json({ existingUser, token })
         }
         else {
            res.status(401).json('incorrect email or password')//password doesnot match
         }

      }
      else {
         res.status(404).json('Account doesnot exist ...')//user doesnot exist
      }

   } catch (error) {
      res.status(500).json(error)
   }

}

//googlelogin
exports.googleLoginController = async (req, res) => {
   const { username, email, password, photo } = req.body
   console.log(username, email, password, photo);

   try {

      const existingUser = await users.findOne({ email })

      if (existingUser) {
         const token = jwt.sign({ userMail: existingUser.email }, 'secretkey')
         res.status(200).json({ existingUser, token })
      }
      else {
         const newUser = new users({
            username,
            email,
            password,
            profile: photo
         })
         await newUser.save()
         const token = jwt.sign({ userMail: newUser.email }, 'secretkey')
         res.status(200).json({ existingUser: newUser, token })
      }

   } catch (error) {
      res.status(500).json(error)
   }
}


//get all users 

exports.getAllUsersController = async (req, res) => {
   const email = req.payload
   console.log(email);

   try {

      const allusers = await users.find({ email: { $ne: email } })
      res.status(200).json(allusers)

   } catch (error) {
      res.status(500).json(error)
   }
}


//edit profile
exports.editAdminProfileController = async (req, res) => {
   console.log('editProfileController');
   const { username, password, profile } = req.body
   const prof = req.file ? req.file.filename : profile
   const email = req.payload
   console.log(email);

   try {
      const AdminDetails = await users.findOneAndUpdate({ email }, { username, email, password, profile: prof }, { new: true })
      await AdminDetails.save()
      res.status(200).json(AdminDetails)


   } catch (error) {
      res.status(500).json(error)
   }

}

//edit admin profile
exports.editUserProfileController = async (req, res) => {
   console.log('editUserProfileController');
   const { username, password, profile , bio } = req.body
   const prof = req.file ? req.file.filename : profile
   const email = req.payload
   console.log(email);

   try {
      const userDetails = await users.findOneAndUpdate({ email }, { username, email, password, profile: prof , bio }, { new: true })
      await userDetails.save()
      res.status(200).json(userDetails)


   } catch (error) {
      res.status(500).json(error)
   }

}
