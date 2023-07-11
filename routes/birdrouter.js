const passport = require('passport')
const express = require('express')
const Router = express.Router()
const { body, validationResult, check } = require('express-validator')
const birdController = require('../controllers/birdController')
const multer = require('multer');
const sd = require('silly-datetime');


const storage = multer.diskStorage({

    destination: function(req, file, cb) {

        if (file.fieldname == 'birdimage') {
            
            cb(null,'./public/birdimage');
            
        } else if (file.fieldname == 'sounds') {
            cb(null,'./public/birdsound');
        } else {
            cb({ error: 'no field name for these files!'});
        }
    },

    filename: function(req,file,cb) {
        cb(null, sd.format(new Date(), 'YYYYMMDD-HHmmss') + '-' + file.originalname);
    }
});


const birdupload = multer({ storage: storage });

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via Passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    // Otherwise, proceed to next middleware function
    return next()
}


// set up role-based authentication
const hasRole = (thisRole) => {
    return (req, res, next) => {
        if (req.user.role == thisRole)
            return next()
        else {
            res.redirect('/homepage')
        }
    }
}



// add page of a bird
Router.get('/',birdController.bird_create_get)

// create a new bird
Router.post('/',birdupload.fields([{ name: 'birdimage'}, { name: 'sounds'}]),birdController.bird_create_post)

// modify an old bird
Router.post('/modify',birdupload.fields([{ name: 'birdimage'}, { name: 'sounds'}]), birdController.bird_modify_post)

// delete an existing sound of a bird
Router.post('/deletesound',birdController.bird_del_sound)

// delete an existing img of a a bird
Router.post('/deleteimg',birdController.bird_del_img)

module.exports = Router