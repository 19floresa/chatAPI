const { db } = require('../database/db')
const ObjectId = require('mongodb').ObjectId

const COLLECTION_USER = "users_info"
const COLLECTION_MSG  = "users_messages"



getID = async (req, res, next) =>
{
    /* This function does two things: verify users and retrieve card id of other user.
        Once this function verifies that the other user exist it will store the card id
        in req.body.other_user.
        */
    try
    {
    
        const { other_user, cardId } = req.body
        if (!other_user) throw "Error middleware: other user is missing"

        const coll = (await db).collection(COLLECTION_USER)

        //check if the user making the request exists
        const user_making_the_request = await coll.findOne({ _id: new ObjectId(cardId)})
        if (!user_making_the_request) throw "Error middleware: User is not found!"
        
        // test if the other user exists
        const user = await coll.findOne({ username: other_user })
        if (!user) throw "Error middleware: other user is not found!"
        
        req.body.other_user = user._id 

        next()
    }
    
    catch(e)
    {
        //console.log(e)
        res.status(400).json({code:400, message: e})
    }
}

module.exports = { 
    getID 
}
