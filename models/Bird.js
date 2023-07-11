const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Schema for bird
const BirdSchema = new Schema(
    {
        name: {type: String, required: true, max: 100},

        introduction: String,

        image:[{ type: Schema.Types.ObjectId, ref: 'Image' }],

        sound:[{ type: Schema.Types.ObjectId, ref: 'Sound' }]
    }
);

// Schema for image
const ImageSchema = new Schema(
    {
        // file name with proper surfix
        filename:{type: String, required: true, max: 100},
        bird:{type: Schema.Types.ObjectId, ref:"Bird"},
    }
);

// virtual to return the url of the image
ImageSchema
    .virtual('path')
    .get(function() {
        console.log("xd");
        return '../birdimg/' + this.filename;
    });

// Schema for audio
const SoundSchema = new Schema(
    {   
        // file name with surfix
        filename:{type: String, required: true, max: 100},
        bird:{type: Schema.Types.ObjectId, ref:"Bird"},
    }
);

// virtual to return the url
SoundSchema
    .virtual('path')
    .get(function() {
        return '../music/' + this.filename;
    });

// export the model
const Image= mongoose.model('Image',ImageSchema);
const Sound = mongoose.model('Sound',SoundSchema);
const Bird = mongoose.model('Bird',BirdSchema);
module.exports = {
    Image,
    Sound,
    Bird,
}