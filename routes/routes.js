const express = require('express')
const router = express.Router()

const { db } = require('../database/db')
const ObjectId = require('mongodb').ObjectId
const { getID } = require('../middleware/middleware.js');

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


router.post('/push', async (req, res) => {
   const { cardId, msg } = req.body;

   // Validate input
   if (!cardId || !msg) {
      return res.status(400).json({ code: 400, message: "Missing cardId or message in request body." });
   }

   try {
       // Validate cardId format
      if (!ObjectId.isValid(cardId)) {
         throw new Error("Invalid cardId format.");
      }

      const _id = new ObjectId(cardId);

      // Verify user exists
      const userCollection = (await db).collection(COLLECTION_USER);
      const user = await userCollection.findOne({ _id });
      if (!user) {
         throw new Error("User not found.");
      }

      // Insert message into the messages collection
      const messagesCollection = (await db).collection(COLLECTION_MSG);
      const result = await messagesCollection.insertOne({
         userId: _id,  // Refer to user's ObjectId correctly
         msg: msg,     // Store the message text
         createdAt: new Date()  // Optionally add a timestamp
      });

      // Log the insert result for debugging
      console.log("Insert result:", result);

      res.status(200).json({
         code: 200,
         message: "Message stored successfully",
         messageId: result.insertedId
      });
   } catch (error) {
         console.error("Error in /push route:", error);
         res.status(400).json({ code: 400, message: error.message });
   }
});


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
