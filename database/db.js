const mongodb = require('mongodb').MongoClient

const MONGO_URL = 'mongodb://localhost:27017'
const MONGO_DB = 'chat-db'

class database_creator {
    constructor (){}
    async create_db ()
    {
        return (await mongodb.connect(MONGO_URL)).db(MONGO_DB)
    }
}

// other method for creating a db
// const db = (async () => { 
//     return (await mongodb.connect(MONGO_URL)).db(MONGO_DB)
// })()

const db = (new database_creator).create_db()

module.exports = { db }

