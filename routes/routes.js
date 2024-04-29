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


router.get('/retrieveAllUsers', async (req, res) => {
   try {
      const coll = (await db).collection(COLLECTION_USER);
      const all_users = await coll.find({}).toArray();
      res.status(200).json({
         code: 200,
         message: "Success",
         users: all_users
      });
   } catch (e) {
      res.status(400).json({
         code: 400,
         message: "Failed to retrieve users: " + e.message
      });
   }
});


router.post('/messagesBetween', async (req, res) => {
   const { userId, otherUserId } = req.body;
   console.log('Fetching messages between:', userId, 'and', otherUserId);

   if (!userId || !otherUserId) {
      return res.status(400).json({ code: 400, message: "Missing userId or otherUserId in request body" });
   }

   try {
      const messagesCollection = (await db).collection(COLLECTION_MSG);
      const messages = await messagesCollection.find({
         $or: [
            { $and: [{ userId: new ObjectId(userId) }, { otherId: new ObjectId(otherUserId) }] },
            { $and: [{ userId: new ObjectId(otherUserId) }, { otherId: new ObjectId(userId) }] }
         ]
      }).sort({ createdAt: -1 }).toArray();

      console.log('Retrieved messages:', messages.length);
      res.status(200).json({
         code: 200,
         message: "Messages retrieved successfully",
         messages
      });
   } catch (error) {
      console.error("Error in /messagesBetween route:", error);
      res.status(500).json({ code: 500, message: error.message });
   }
});


router.post('/logout', async (req, res) => {
   try {
      res.status(200).json({ code: 200, message: "Logged out successfully" });
   } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ code: 500, message: "Logout failed" });
   }
});


router.post('/logoutAll', async (req, res) => {
   try {
      res.status(200).json({ code: 200, message: "All users logged out successfully" });
   } catch (error) {
      console.error("Error during logout all users:", error);
      res.status(500).json({ code: 500, message: "Logout all users failed" });
   }
});


router.post('/push', async (req, res) => {
   const { cardId, msg, other_user } = req.body;
   if (!cardId || !msg || !other_user) {
      return res.status(400).json({ code: 400, message: "Missing cardId or message in request body." });
   }

   try {
      const userCollection = (await db).collection(COLLECTION_USER);
      const sender = await userCollection.findOne({ _id: new ObjectId(cardId) });
      const receiver = await userCollection.findOne({ _id: new ObjectId(other_user) });

      if (!sender || !receiver) {
         throw new Error("User not found.");
      }

      const messagesCollection = (await db).collection(COLLECTION_MSG);
      const result = await messagesCollection.insertOne({
         userId: new ObjectId(cardId),
         otherId: new ObjectId(other_user),
         msg: msg,
         createdAt: new Date()
      });

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


router.get('/selectMessages', getID, async (req, res) => // make query************
{
   /* This function lets you select the LAST 10 messages taken out of the database.
      With the variable data_index you take out (10 * data_index) messages from the db,
      then you return the last 10 messages from the previous result.
      */
   try
   {
      const { cardId, data_index, other_user  } = req.body
      if (!cardId) throw "Error in push: missing cardId!"
   
      const _id = new ObjectId(cardId); //ObjectId.createFromTime() // i think i can use this to find messages between a date
      const _otherId =  new ObjectId(other_user);

      // const coll = (await db).collection(COLLECTION_USER)
      // const user = await coll.findOne({ _id })
      // if (!user) throw "Error: User was not found!"


      // calculate next 10 messages
      if (data_index == undefined) throw "Error: Data index is undefined"
      const low = 10 * data_index
      const i = (data_index ? (data_index + 1) : 1)
      const max =  10 * i

      const coll_msg = (await db).collection(COLLECTION_MSG)
      let result = await coll_msg.find({ userId: _id, otherId: _otherId}).sort({createdAt: -1}).limit(max).toArray() // will need to find between a range

      result = result.slice(low)
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


router.get('/recentMessages', getID, async (req, res) => // make query************
{
   /*
   This function will give you the top 10 messages
   */
   try
   {
      const { cardId, other_user } = req.body
      if (!cardId) throw "Error in push: missing cardId!"
   
      const _id = new ObjectId(cardId); //ObjectId.createFromTime() // i think i can use this to find messages between a date
      const _otherId = new ObjectId(other_user); 

      // const coll = (await db).collection(COLLECTION_USER)
      // const user = await coll.findOne({ _id })
      // if (!user) throw "Error: User was not found!"

      const coll_msg = (await db).collection(COLLECTION_MSG)
      const result = await coll_msg.find({ userId: _id, otherId: _otherId }).sort({createdAt: -1}).limit(10).toArray() // will need to find between a range
      
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
