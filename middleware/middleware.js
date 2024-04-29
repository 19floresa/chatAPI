const { db } = require('../database/db')
const ObjectId = require('mongodb').ObjectId

const COLLECTION_USER = "users_info"
const COLLECTION_MSG  = "users_messages"


const getID = async (req, res, next) => {
    /* This function does two things: verify users and retrieve card id of other user.
        Once this function verifies that the other user exist it will store the card id
        in req.body.other_user.
    */
    try {
        const { other_user, cardId } = req.body;
        console.log("Received cardId: ", cardId, " and other_user: ", other_user); // Log received data

        if (!other_user) throw "Error middleware: other user is missing";

        const coll = (await db).collection(COLLECTION_USER);

        let user = null;
        if (ObjectId.isValid(other_user)) {
            user = await coll.findOne({ _id: new ObjectId(other_user) });
        } else {
            user = await coll.findOne({ username: other_user });
        }

        if (!user) throw "Error middleware: other user is not found!";

        req.body.other_user = user._id.toString();
        next();
    } catch (e) {
        console.error("Middleware error: ", e);
        res.status(400).json({ code: 400, message: e });
    }
};


module.exports = { 
    getID 
}
