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

router.get('/retrieveAllUsers', async (req, res) =>
{
   try
   {
      const { cardId } = req.body
      console.log(req)
      const _id = new ObjectId(cardId);
      
      const coll = (await db).collection(COLLECTION_USER)    
      const user = await coll.findOne({ _id}) // maybe salt password
      if (!user) throw "Error: users could not be verified"

      const all_users = await coll.find().toArray()

      res.status(200).json(
         {
            code: 200, 
            message: "success", 
            cardId: all_users
         }) 
   } 
   catch (e)
   {
      res.status(400).json({code:400, message: e})
   }
})


router.post('/push', getID, async (req, res) => {
   const { cardId, msg, other_user } = req.body;

   // Validate input
   if (!cardId || !msg || !other_user) {
      return res.status(400).json({ code: 400, message: "Missing cardId or message in request body." });
   }

   try {
       // Validate cardId format
      if (!ObjectId.isValid(cardId)) {
         throw new Error("Invalid cardId format.");
      }

      const _id = new ObjectId(cardId);
      const _otherId = new ObjectId(other_user);

      // Verify user exists
      // const userCollection = (await db).collection(COLLECTION_USER);
      // const user = await userCollection.findOne({ _id });
      // const otherUser = await userCollection.findOne({ _otherId });
      // if (!user || otherUser) {
      //    throw new Error("User not found.");
      // }

      // Insert message into the messages collection
      const messagesCollection = (await db).collection(COLLECTION_MSG);
      const result = await messagesCollection.insertOne({
         userId: _id,  // Refer to user's ObjectId correctly
         otherId: _otherId, // person you sent msg too
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
