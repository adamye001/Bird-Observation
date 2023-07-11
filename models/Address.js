const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create an schema
const addressSchema = new mongoose.Schema({
    address:{ type: String},
    note: {type:String},
    lat: {type: String},
    lng: {type : String},
    latlng:{type : String},
    trips: [{type:Schema.ObjectId}],
});


var addressModel = mongoose.model('addressModel', addressSchema, "Address");

module.exports = addressModel;