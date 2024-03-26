const express = require('express')
const router = express.Router()

router.get('/', (req, res) => 
    {
     res.send('Hello World!')
    })


router.post('/login', (req, res) =>
   {
      try
      {
      const { username, password } = req.body
      if (!username || !password) throw "Error: Missing user info!"
      
      /* search db */

      res.status(200).json({code:200, message:"success"}) // maybe send a different html screen?
      } 
      catch (e)
      {
         res.status(400).json({code:400, message: e})
      }
   })


router.post('/push', (req, res) =>
   {
      try
      {
      const { username, message } = req.body
      if (!username || !message) throw "Error: Missing user info!"
      
      /* insert new message to db */

      res.status(200).json({code:200, message:"success"}) // maybe send a different html screen?
      } 
      catch (e)
      {
         res.status(400).json({code:400, message: e})
      }
    })


// pop function to remove a message

//update: user gives time they want data from


module.exports = router
