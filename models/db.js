// Set up connection to MongoDB database, via Mongoose

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const mongoose = require('mongoose');

const mongooseClient = mongoose
	.connect(process.env.MONGO_URL, { dbName: 'birdProject' }) // MongoDB user/password details are in .env file
	.then((m) => m.connection.getClient());

const db = mongoose.connection.on('error', (err) => {
	console.error(err);
	process.exit(1);
});

// connect to database
db.once('open', async () => {
	console.log(`Mongo connection started on ${db.host}:${db.port}`);
});

// get the user.js model
require('./Users');

module.exports = mongooseClient;
