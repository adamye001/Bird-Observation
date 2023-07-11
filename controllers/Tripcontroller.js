const {Image,Sound,Bird} = require("../models/Bird.js")
const Address = require("../models/Address")
const Trip = require("../models/Trip")
const BirdTrip = require("../models/BirdsTrip")

const { body,check,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
var async = require('async');


// GET for create a trip
exports.trip_create_get = (req,res,next) => {
    
    return res.render('addnewtrip');
    
};

// return the bird options as a json
exports.trip_bird_get = (req,res,next) => {
    console.log('order received!');
    Bird.find().lean().exec(function (err, result) {
        
        res.json(JSON.stringify(result));
    })
    

};

// return all the trip options as a json
exports.trip_addr_get = (req,res,next) => {
    console.log("start to fetching address!");
    Address.find().lean().exec(function (err, result) {
        console.log("address fetched!" + result);
        res.json(JSON.stringify(result));
    })
};

// submission of adding a trip
exports.trip_create_post = [

    // check validation
    body('address','Address is required to create a trip!').isLength({min:1}),

    body('date','Date is required to create a trip!').isLength({min:1})
    .custom(date => {

        
        var dateformate = /^\d{2}\/\d{2}\/\d{4}$/; // the data must be in format of "XX/XX/XXXX" 

        if(dateformate.test(date)) {

            return true;

        } else {

            return false;

        }


    })
    .withMessage("Invalid date input! Please, follow the instruction format!"),

    // clean the data
    body('tripintro').trim().escape(),

    
    async (req,res,next) => {

        const errors = validationResult(req);

        // create DOM for new trip
        var trip = new Trip(
            {
                date: req.body.date,
                note: req.body.tripintro
            }
        );
        
        // render the page with err msg if there is error
        if (!errors.isEmpty()) {

            res.render('addnewtrip', { address: req.body.address, trip: trip, birdlist: req.body.birdlist, errors: errors.array()});
            return;

        } else {
            
            // variable to check if any error occurs during saving
            var addressNotFound = undefined;
            var birdsNotFound = undefined;


            // check if the address is valid
            await Address.findOne({address: req.body.address}).then( foundAddr => {

                if(foundAddr) {
                    
                    // store and save the DOM if valid
                    console.log('address found! saving trip!');
                    trip.address = foundAddr._id;

                    trip.save( function(err) {
                        if(err) {
                            console.log("Failed to save trip!");
                            return next(err);
                        }
                    });


                } else {

                    // store the err and output an error msg 
                    console.log("Cannot find the address!!");
                    addressNotFound = true;
                    
                }
            }).catch(err => {
                next(err);
            });


            // render the page with errors if there is any
            if(addressNotFound == true) {
                
                return res.render('addnewtrip', {trip: trip, birdlist: req.body.birdlist, addressNotFound: addressNotFound});

            }

            

            let birds = req.body.birdlist; // birdlist linked to this trip

            // store the link for all birds
            async.map(birds, function(birdName, callback) {
                
                // only one bird of that specific name can exist in the database
                Bird.findOne({name: birdName}).exec( function(err,foundBird) {
                    
                    if(foundBird) {

                        // check if the link is already stored in the databse
                        BirdTrip.findOne({bird: foundBird._id, trip: trip._id}).exec(function(err,foundBirdTrip) {

                            if(err) {return next(err);}

                            // store the link if there isnt already one
                            if(!foundBirdTrip) {

                                var newBirdTrip = new BirdTrip({bird: foundBird._id, trip: trip._id});

                                newBirdTrip.save(function(err) {

                                    if(err) {return next(err);}

                                    console.log("BirdTrip save successfully!");
                                    callback(null,birdName);

                                });

                            } else {

                                callback(null);

                            }
                        });
                    } else {

                        // store and output err msg if cannot find the bird in the databse
                        console.log("Bird not found in the database!")

                        birdsNotFound = true;

                        callback(null);
                    }
                });


            }, function(err,results){

                if(err) { return next(err);}
                
                // refresh the page if there is any error
                if(birdsNotFound) {

                    return res.redirect('/addnewtrip/modify?id=' + trip._id);


                } else {
                    return res.redirect('/tripmanagement');
                }

            });
            
            

        


            



            
        }
        
    }

];