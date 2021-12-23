let mongoose = require('mongoose');

const server = 'localhost:27017';
const database = 'myfood';

const openConnection = async () => {
  try {
    await mongoose.connect(`mongodb://${server}/${database}`)

    console.log('Database connection successful')
  } catch (err) {
    console.error('Database connection failed ' + err)
  }
}

const closeConnection = async () => {
  await mongoose.connection.close()
  console.log('Database connection closed')
}

module.exports = { openConnection, closeConnection }