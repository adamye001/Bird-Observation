const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create an schema
const tripSchema = new mongoose.Schema({
    address:{type: Schema.Types.ObjectId},
    note: String,
    date:String,
    birds:[{type: Schema.Types.ObjectId}],
});

var tripModel = mongoose.model('tripModel', tripSchema, "Trips");

module.exports = tripModel;