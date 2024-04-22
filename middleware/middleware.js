const { db } = require('../database/db')

const COLLECTION_USER = "users_info"
const COLLECTION_MSG  = "users_messages"



getID = async (req, res, next) =>
{
    try
    {
        const { other_user } = req.body
        if (!other_user) throw "Error middleware: other user is missing"

        const coll = (await db).collection(COLLECTION_USER)
        const user = await coll.findOne({ username: other_user })
        if (!user) throw "Error middleware: User is not found!"
        
        req.body.cardId = user._id

        next()
    }
    
    catch(e)
    {
        res.status(400).json({code:400, message: e})
    }
}

module.exports = { 
    getID 
}
