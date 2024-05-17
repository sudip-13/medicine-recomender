require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = () => {
  const url = process.env.DB;
 
  
  if (url) {
    try {
      mongoose.connect(url);
    } catch (err) {
      console.log('ERROR: ', err.message);
      process.exit(1);
    }

    const dbConnection = mongoose.connection;
    dbConnection.once('open', () => {
      console.log('Database connected');
    });

    dbConnection.on('error', (err) => {
      console.error('Connection error: ', err);
    });
  }
};
module.exports = connectDB;