const express = require('express')
const router = express.Router()

const { db } = require('../database/db')
const ObjectId = require('mongodb').ObjectId

const COLLECTION_USER = "users_info"
const COLLECTION_MSG  = "users_messages"




router.post('/register', async (req, res) => 
{
   try
   {
      const { username, password } = req.body
      if (!username || !password) throw "Error in register: Missing user info!"
         
      const coll = (await db).collection(COLLECTION_USER)
         
      let user =  await coll.findOne({ username })
      if (user) throw "Error: user already exists!"

      user = await coll.insertOne({ username, password })

      res.status(200).json(
         {
            code: 200, 
            message: "User was inserted", 
            cardId: user.insertedId
         }) 
   } catch (e)
   {
      res.status(400).json({code:400, message: e})
   }
})


router.post('/login', async (req, res) =>
{
   try
   {
      const { username, password } = req.body
      if (!username || !password) throw "Error in login: Missing user info!"
      
      const coll = (await db).collection(COLLECTION_USER)
         
      let user =  await coll.findOne({ username, password }) // maybe salt password
      if (!user) throw "Error: user does not exist!"

      res.status(200).json(
         {
            code: 200, 
            message: "success", 
            cardId: user._id
         }) 
   } 
   catch (e)
   {
         res.status(400).json({code:400, message: e})
   }
})


router.post('/push', async (req, res) =>
{
   try
   {
      const { cardId, msg } = req.body
      if (!cardId) throw "Error in push: missing cardId!"
      if (!msg) throw "Error: No message to store!"

      const _id = new ObjectId(cardId); //ObjectId.createFromTime() // i think i can use this to find messages between a date

      const coll = (await db).collection(COLLECTION_USER)
      const user = await coll.findOne({ _id }) // what if its not found?
      if (!user) throw "Error: User was not found!"

      const coll_msg = (await db).collection(COLLECTION_MSG)
      const result = await coll_msg.insertOne(
         {
            id: _id,
            msg: msg
         })
     // console.log(result)

      res.status(200).json(
         {
            code: 200, 
            message: "success"
         })
   } 
   catch (e)
   {
      // console.log(e)
      res.status(400).json({code:400, message: e})
   }
})


router.get('/selectMessages', async (req, res) => // make query************
{
   try
   {
      const { cardId } = req.body
      if (!cardId) throw "Error in push: missing cardId!"
   
      const _id = new ObjectId(cardId); //ObjectId.createFromTime() // i think i can use this to find messages between a date

      const coll = (await db).collection(COLLECTION_USER)
      const user = await coll.findOne({ _id })
      if (!user) throw "Error: User was not found!"

      const coll_msg = (await db).collection(COLLECTION_MSG)
      const result = await coll_msg.find({ id: _id }).toArray() // will need to find between a range
      
      res.status(200).json(
         {
            code: 200, 
            message: "success",
            result: result
         })
   }
   catch (e)
   {
      res.status(400).json({code:400, message: e})
   }
})


// pop function to remove a message

//update: user gives time they want data from; like hearbeat 


module.exports = router
