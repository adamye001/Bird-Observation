const Markers = require("../models/Marker")
const Address = require("../models/Address")
const {Image,Sound,Bird} = require("../models/Bird.js")
const Trip = require("../models/Trip.js")
const BirdsTrip = require("../models/BirdsTrip.js")
var async = require('async');

const checkrole = async(req, res) => {
    if (req.user.role === 'admin') {
        res.redirect('/map')
    } else {
        res.redirect('/login')
    }
}



const sendmapdata = async (req, res) =>{

    const note = await Address.find().lean();
    const markers = await Address.find().lean();
    
    const latlng= [];
    for(let i = 0; i< note.length; i++){
        var trip = await Trip.find({address:note[i]._id}).lean();
        note[i]["trip"] = trip;
    }
    for(let i = 0; i< markers.length; i++){
        x = ([markers[i].lat,markers[i].lng])
        latlng.push(x);
    }
    return res.render('map', {data:latlng, note:note})
}

const sendaddressdata = async (req, res) =>{
    const markers = await Address.find().lean();
    
    const latlng= []
        for(let i = 0; i< markers.length; i++){
            x = ([markers[i].lat,markers[i].lng])
            latlng.push(x);
        }
    return res.render('addnewaddress', {data:latlng})
}


const addnewaddress = async (req, res) => {
    if(req.body.lat != "" && req.body.lng != ""){
    y = new Address({
        address : req.body.address,
        note: req.body.note,
        lat:req.body.lat,
        lng:req.body.lng,
        latlng :(req.body.lat.toString()+","+req.body.lng.toString())

    })
    await y.save();
    
    }
    return res.redirect("map")

}


const getbird = async (req, res) =>{
    
    const bird = await Bird.findOne({name:req.params.name}).lean();
    if (!bird) {
        // no author found in database
        return res.sendStatus(404)
    }
    const image = await Image.findOne({bird:bird._id}).lean()
    const sound = await Sound.findOne({bird:bird._id}, "filename").lean()
    console.log(sound)

    return res.render('birddisplay', { data: bird , image:image, sound:sound})

}
const addbird = async (req, res) =>{
    
    bird = new Bird({
        name:"Cacatua",
        introduction:"common parrots in Australia12312",
        
    })
    const image = new Image({
        filename:"RedcrestedTuraco 1.png",
        bird : bird._id,
        
    })
    await image.save();
    await bird.save();

}
const addtrip = async (req, res) =>{
    
    var birdlist = [];
    var databird = req.body.birdlist;
    if(typeof req.body.birdlist == "string"){
        databird = [req.body.birdlist]
    }
    console.log(databird);
    for(var i = 0; i< databird.length;i++){
        birdlist[i] = await Bird.findOne({name:databird[i]}, "_id");
        
    }
    
    var birdtrip = await BirdsTrip.find({trip:req.query.id})
    console.log(birdtrip);
    if(await Trip.findOne({_id:req.query.id}).lean()){
        var address = await Address.findOne({_id:req.body.addressid});
        await Trip.findOneAndUpdate({_id:req.query.id},{$set:{address:address, date : req.body.date, note:req.body.tripintro}},{new: true});
        
        for(var i = 0; i< birdtrip.length; i++){
            if(!(birdlist.includes(birdtrip[i].bird))){
                await BirdsTrip.deleteOne({bird: birdtrip[i].bird, trip: req.query.id});
                
            }
        }
        
        for(var i = 0; i< birdlist.length; i++){
            if(!(await BirdsTrip.findOne({bird:birdlist[i]._id, trip:req.query.id}))){
                
                var newbirdtrip = new BirdsTrip({
                    bird:birdlist[i],
                    trip:req.query.id,
                })
                await newbirdtrip.save()
            }
        
    }
    
    }else{
        var address = await Address.findOne({address:req.body.address}).lean()
        var newtrip = req.body;
        var one = new Trip({
            address:address,
            note:req.body.tripintro,
            date:req.body.date,
        })
        await one.save();
        var newbirdlist = req.body.birdlist
        if(typeof req.body.birdlist == "string"){
            newbirdlist = [newbirdlist];
        }
        if(newbirdlist){
        for(var i = 0; i< newbirdlist.length; i++){
            var bird = await Bird.findOne({name:newbirdlist[i]})
            var birdtrip = new BirdsTrip({
                bird:bird._id,
                trip:one._id,
            })
            await birdtrip.save()
        }

    }
}
    return res.redirect("/tripmanagement")

}
const locationdisplay = async (req, res) =>{

    console.log(req.params)
    const trip = await Trip.find({_id:req.params.address_id}).lean()
    const bird = await BirdsTrip.find({trip: req.params.address_id}, 'bird').lean()
    const note = await Trip.findOne({_id: req.params.address_id}, 'note').lean()
    
    const birdname = [];
    if(bird != null){
        for(var i = 0; i< bird.length; i++){
            birdname[i] = await Bird.findById(bird[i].bird, 'name').lean();
        }
    }
    
    const time = await Trip.find({_id: req.params.address_id}).lean()
    return res.render('locationdisplay', {time:time, bird:birdname, note:note})

}
const locationdisplay2 = async (req, res) =>{

    
    var date = req.params.month+'/'+req.params.day+'/'+req.params.year;
    const trip = await Trip.findOne({address:req.params.address_id, date:date}).lean()
    console.log(trip)
    const bird = await BirdsTrip.find({trip: trip._id}, 'bird').lean()
    const note = await Trip.findOne({_id: trip._id}, 'note').lean()
    
    const birdname = [];
    if(bird != null){
        for(var i = 0; i< bird.length; i++){
            birdname[i] = await Bird.findById(bird[i].bird, 'name').lean();
        }
    }
    
    const time = await Trip.find({_id: trip._id}).lean()
    return res.render('locationdisplay', {time:time, bird:birdname, note:note})

}
const sendallbird = async (req, res) =>{
    bird = await Bird.find().lean();
    
    for(let i = 0; i< bird.length; i++){
        var image = await Image.findOne({bird:bird[i]._id}).lean();
        var sound = await Sound.findOne({bird:bird[i]._id}, "filename").lean()
        bird[i]["image"] = image;
        bird[i]["sound"] = sound;
        if(image) {
            console.log(image.filename);
        } else {
            console.log("no images!");
        }
        
    }
    console.log(bird)
    return res.render('birdmanagement',{data:bird})

}
const birdsearch =  async (req, res) =>{
    var key = new RegExp(req.query.search, 'i')
    bird = await Bird.find({name:key}).lean()
    for(let i = 0; i< bird.length; i++){
        var image = await Image.findOne({bird:bird[i]._id}).lean();
        bird[i]["image"] = image;
    }

    return res.render('birdmanagement',{data:bird})
}

const deletebird =  async (req, res) =>{
    await Bird.remove({_id:{$in:req.body.id}})
    await BirdsTrip.remove({bird:req.body.id});
    
    return res.redirect('/birdmanagement')
}
const birdmodify =  function (req, res,next) {

    if(req.query.id == null){
        return res.redirect('/birdmanagement')
    }
    
    // parallel query the database
    async.parallel({

        bird: function(callback) {
            Bird.findById(req.query.id)
            .exec(callback);
        },

        images: function(callback) {
            Image
            .find({ bird : req.query.id})
            .exec(callback);
        },

        sounds: function(callback) {
            Sound
            .find({ bird : req.query.id})
            .exec(callback);
        },  

    }, function(err,results) {

        if(err) { return next(err);}

        if( results.bird == null ) {
            var err = new Error('Bird not found');
            err.status = 404;

            return next(err);
        }
        console.log('query success:' + results.bird.name + results.bird.introduction);
        res.render('addnewbird',{ bird : results.bird, images : results.images, sounds : results.sounds, referer: req.body.referer});

    });


        
    
   
}
const tripsearch =  async (req, res) =>{
    var key = new RegExp(req.query.search, 'i')
    trip= await Trip.find({date:key}).lean()
    if(trip == null){
        trip = await Trip.find({note:key}).lean()
    }


    return res.render('birdmanagement',{data:bird})
}
const sendalltrip =  async (req, res) =>{
    trip= await Trip.find().lean()
    for(let i = 0; i< trip.length; i++){
        var address = await Address.findOne({_id:trip[i].address}).lean()

        trip[i]["address"] = address
    }
    var date= await Trip.find({}, "date -_id").lean()
    const key = 'date';
    const unique = [...new Map(date.map(item => [item[key], item])).values()]
    return res.render('tripmanagement',{data:trip, date:unique})
}

const tripmodify =  async (req, res) =>{
    
    if(req.query.id == null){
        return res.redirect('/tripmanagement')
    }
    trip = await Trip.findById(req.query.id).lean()
    
    var address = await Address.findOne({_id:trip.address}).lean()
    trip["address"] = address
    const bird = await BirdsTrip.find({trip: req.query.id}, 'bird').lean()
        for(let i = 0; i< trip.length; i++){
        var address = await Address.findOne({_id:trip[i].address}).lean()

        trip[i]["address"] = address
    }
    const birdname = [];
    for(var i = 0; i< bird.length; i++){
            birdname[i] = await Bird.findById(bird[i].bird, 'name').lean();
        
    }
    console.log(birdname);
    return res.render('addnewtrip',{data:trip, birdlist:birdname})
}

const deletetrip =  async (req, res) =>{
    await Trip.deleteOne({_id:{$in:req.body.id}})
    
    return res.redirect('/tripmanagement')
}
module.exports = {
    checkrole,
    sendmapdata,
    sendaddressdata,
    addnewaddress,
    getbird,
    addbird,
    locationdisplay,
    addtrip,
    sendallbird,
    birdsearch,
    tripsearch,
    deletebird,
    birdmodify,
    tripmodify,
    sendalltrip,
    deletetrip,
    locationdisplay2,
}