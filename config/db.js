const mongoose = require('mongoose')

const connectToDb = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then((conn) => {
        console.log(`connected to db at ${conn.connection.host}`);
    })
    .catch((error) => {
        console.log(error.message , "wrong password")
        process.exit(1)
    })
}

module.exports = connectToDb