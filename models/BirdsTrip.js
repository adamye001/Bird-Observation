const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BirdTripSchema = new Schema(
    {
        bird:{type: Schema.Types.ObjectId, ref:"Bird"},
        trip: {type: Schema.Types.ObjectId, ref:"tripModel"},
    }
);
const BirdTrip = mongoose.model('BirdTrip',BirdTripSchema,'BirdTrip');
module.exports = BirdTrip;