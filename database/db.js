const mongodb = require('mongodb').MongoClient

const MONGO_URL = 'mongodb://localhost:27017'
const MONGO_DB = 'chat-db'

const db = (async () => { 
    return (await mongodb.connect(MONGO_URL)).db(MONGO_DB)
})()

module.exports = { db }

