const mongoose = require('mongoose');



// create an schema
const markerSchema = new mongoose.Schema({
    lat: { type: String},
    lng :{type : String},
});


var markerModel = mongoose.model('markerModel', markerSchema, "Markers");

module.exports = markerModel;