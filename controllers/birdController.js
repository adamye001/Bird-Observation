const {Image,Sound,Bird} = require("../models/Bird.js")
const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
var async = require('async');
const fs = require("fs")



// GET for add a bird
exports.bird_create_get = (req,res,next) => {
    
    // render the page
    console.log("Come from: " + req.headers.referer);
    res.render('addnewbird',{ referer: req.headers.referer});
};


// submit of adding a bird
exports.bird_create_post = [

    // check if the name satisfy the rules
    body('name','Bird name required!').isLength({ min: 1}).trim().escape(),
    
    // get the introduction clean
    body('introduction').trim().escape(),

    (req,res,next) => {

        // check if there is errors
        const errors = validationResult(req);

        // create a DOM for new bird
        var bird = new Bird(
            {
                name: req.body.name,
                introduction: req.body.introduction
            }
        );

    



        if( !errors.isEmpty()) {

            // render the page with the errors
            res.render('addnewbird', { bird: bird, errors: errors.array()});
            return;


        } else {

            Bird.findOne({name: req.body.name})
            .exec( function(err, foundBird) {

                if(err) {return next(err);}

                // if there is already a bird of this name
                if(foundBird) {

                    // need to rename the bird to store it
                    res.render('addnewbird', { bird: bird, rename: true});

                } else {

                    // otherwise, save the DOM
                    bird.save( function(err) {

                        if (err) { return next(err);}

                    });

                    // store the image info in database
                    for(var tempimage in req.files['birdimage']) {


                        var newImage = new Image(
                            {
                                filename: req.files['birdimage'][tempimage].filename,
                                bird: bird._id
                            }
                        );
        
                        // save the DOM
                        newImage.save( function(err) {

                            if(err) { 

                                console.log('failed to save images!');
                                return next(err); 

                            }
                        
                        });
                    }

                    // store the sounds info
                    for(var tempsounds in req.files['sounds']) {

                        var newSound = new Sound(
                            {
                                filename: req.files['sounds'][tempsounds].filename,
                                bird: bird._id
                            }
                        );


                        newSound.save( function(err) {
                            if(err) { 
                                console.log('failed to save sounds!');
                                return next(err); 
                            }
                        
                        });
                    }
                        
                    
                    // if there is a 'back' url
                    if (req.body.referer && (req.body.referer !== undefined)) {

                        return res.redirect(req.body.referer);

                    } else {

                        console.log("no referer detected! Go to birdmanagement page");
                        return res.redirect('/birdmanagement');

                    }
                    

                }

            });

           

        }

        
    }
];

// submission of modifying a bird 
exports.bird_modify_post = [

    async (req,res,next) => {

        // get the DOM of the bird to be modified
        res.locals.birdStored = await Bird.findById(req.body.birdID);
        
        // check validation
        if(res.locals.birdStored == undefined) {
            var err = new Error("Cannot get data of this bird from the database. Please try again later!");
            err.status = 404;
            return next(err);
            
        }

        next();
        
    },

    // check validation of the name
    body('name').isLength({ min: 1})
    .withMessage("Name is required for a bird!"),
    
    // clean the data
    body('introduction').trim().escape(),


    (req,res,next) => {


        let errors = validationResult(req);
        
        // render the page with err msg if there are errors
        if (!errors.isEmpty()) {


            async.parallel({

                images: function(callback) {
                    Image
                    .find({ bird : res.locals.birdStored._id})
                    .exec(callback);
                },
        
                sounds: function(callback) {
                    Sound
                    .find({ bird : res.locals.birdStored._id})
                    .exec(callback);
                },


            }, function(err,results) {

                if(err) {return next(err);}

                res.render('addnewbird',{ bird : res.locals.birdStored, images : results.images, sounds : results.sounds, referer: req.body.referer, errors: errors.array()});
                return;

            });



        } else {
            
            // save bird, new image, new sounds info in the database
            async.parallel({


                saveBird(callback) {

                    // apply the modification
                    res.locals.birdStored.introduction = req.body.introduction;

                    // check if the name stay the same
                    if(res.locals.birdStored.name == req.body.name) {

                        // save the DOM if the name unchanged
                        res.locals.birdStored.save( function(err) {

                            if(err) {return next(err);}

                            return callback(null,true);

                        });


                    } else {

                    
                        // check if there is already a name in the database 
                        Bird.findOne({name: req.body.name}).exec( function(err, foundBird) {

                            if(err) {return next(err);}

                            if(foundBird) {

                                // unable to change to new name if there is already a bird of the same name
                                res.locals.birdStored.save( function(err) {

                                    if(err) {return next(err);}

                                    return callback(null,false);

                                });

                                
                                

                            } else {

                                // change to new name if there isnt 
                                res.locals.birdStored.name = req.body.name;

                                res.locals.birdStored.save( function(err) {

                                    if (err) {return next(err);}

                                    return callback(null,true);

                                });

                            }
                        });
                    }

                    
                },

                saveImage(callback) {

                    // check there is anything to upload
                    if((req.files['birdimage'] == undefined) || (req.files['birdimage'].length == 0)) {
                        return callback(null,false);
                    }

                    // save info for all new upload
                    async.map(req.files['birdimage'],function(imagefile,cb) {

                        var newImage = new Image({
                            filename: imagefile.filename,
                            bird: res.locals.birdStored._id,
                        });

                        newImage.save( function(err) {

                            if (err) {return next(err);}

                            cb(null,true);

                        });


                    }, function(err,results) {

                        if(err) {return next(err);}
                        callback(null,true);

                    });
                },

                saveSound(callback) {

                    // check if there is new upload
                    if((req.files['sounds'] == undefined) || (req.files['sounds'].length == 0)) {
                        return callback(null,false);
                    }

                    // save for all uploads
                    async.map(req.files['sounds'], function(soundfile, cb) {

                        var newSound = new Sound({
                            filename: soundfile.filename,
                            bird: res.locals.birdStored._id,
                        });

                        newSound.save( function(err) {
                            if (err) {return next(err);}
                            cb(null,true);
                        });

                    }, function(err,results) {
                        if(err) {return next(err);}
                        callback(null,true);
                    });
                },


            }, function(err,results) {

                if(err) {return next(err);}

                // if save the bird without error
                if (results.saveBird == true) {

                    // go 'back' if there is one
                    if (req.body.referer && (req.body.referer !== undefined)) {

                        console.log(req.body.referer);
                        return res.redirect(req.body.referer);

                    } else {

                        console.log("no referer detected! Go to birdmanagement page");
                        return res.redirect('/birdmanagement');

                    }

                } else {


                    //render the page with error msg if save unsuccessfully
                    async.parallel({

                        images: function(callback) {
                            Image
                            .find({ bird : res.locals.birdStored._id})
                            .exec(callback);
                        },
                
                        sounds: function(callback) {
                            Sound
                            .find({ bird : res.locals.birdStored._id})
                            .exec(callback);
                        },
        
        
                    }, function(err,results) {
        
                        if(err) {return next(err);}
        
                        res.render('addnewbird',{ bird : res.locals.birdStored, images : results.images, sounds : results.sounds, referer: req.body.referer, rename: true});
                        return;
        
                    });
                }
                
            });
        }
        
    }
];

// delete a sound of a bird
exports.bird_del_sound = (req, res, next) => {

    
    if(req.body.soundFileID == undefined) {
        return res.json(JSON.stringify({success:false, errmsg: "Sound ID is empty!"}));
    }


    // find the DOM to delete in the database
    Sound.findById(req.body.soundFileID).exec( function(err, foundSound) {

        if(err) {return next(err);}

        if(foundSound) {

            // store the filename
            let soundFileName = foundSound.filename; 


            // delete both file and info of the sound
            async.parallel({

                delDatabase(callback) {

                    foundSound.remove( function(err) {

                        if(err) {return next(err);}

                        return callback(null,true);

                    });


                },

                delLocalFile(callback) {

                    // store whether the action is successful
                    var deleted = deleteFile("public/birdsound/",soundFileName);

                    return callback(null,deleted);

                },

            }, function(err, results) {

                if(err) {return next(err);}

                // if failed to delete the file, return with err msg
                if(!results.delLocalFile) {

                    var resData = JSON.stringify({success:false, errmsg: " Failed to delete local file. "});
                    return res.json(resData);

                }


                // return success if all passed
                var resData = JSON.stringify({success: true});
                return res.json(resData);

            });


        } else {

            // return the error msg
            var resData = JSON.stringify({success:false, errmsg: " Cannot find the file in database. "});
            return res.json(resData);

        }
    });




}

// delete a file of the path
function deleteFile(path,name) {

    // check validation
    if( fs.existsSync(path)) {

        console.log("Find the path");

        // get the filepath
        var filepath = path.concat(name);

        // check if file exists
        if(fs.existsSync(filepath)) {

            console.log("Find the file");

            fs.unlinkSync(filepath); // delete the file

            console.log("delete file at : " + filepath);

            return true;

        } 

    } else {

        console.log("File path error!");

    }

    return false;

    
}

// delete img of a bird
exports.bird_del_img = (req, res, next) => {

    // check if ID is valid
    if(req.body.imgID == undefined) {
        return res.json(JSON.stringify({success:false, errmsg: "Image ID is empty!"}));
    }

    // query the DOM for that file
    Image.findById(req.body.imgID).exec( function(err, foundImg) {

        if(err) {return next(err);}

        if(foundImg) {

            let imgFileName = foundImg.filename; // store filename

            // delete both file name info in local and database
            async.parallel({

                delDatabase(callback) {

                    foundImg.remove( function(err) {

                        if(err) {return next(err);}

                        callback(null,true)

                    });
                },

                delLocalFile(callback) {

                    // store if delete successfully
                    var deleted = deleteFile("public/birdimage/",imgFileName);

                    return callback(null,deleted);

                },


            }, function(err,results) {

                if(err) {return next(err);}

                // if successfully delete localfile
                if(!results.delLocalFile) {

                    var resData = JSON.stringify({success:false, errmsg: " Failed to delete local file. "});
                    return res.json(resData);

                }

                // return success if all passed
                var resData = JSON.stringify({success: true});
                return res.json(resData);


            });




        } else {

            // return err with errmsg
            var resData = JSON.stringify({success:false, errmsg: " Cannot find the file in database. "});
            return res.json(resData);

        }
    });
}