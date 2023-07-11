const passport = require('passport')
const express = require('express')
const Router = express.Router()
const tripController = require('../controllers/Tripcontroller')
const { body, validationResult, check } = require('express-validator')

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
            res.redirect('/')
        }
    }
}

// add page of a trip
Router.get('/',tripController.trip_create_get)

// get bird options 
Router.get('/birds',tripController.trip_bird_get)

// create a new trip
Router.post('/',tripController.trip_create_post)

// get trip options
Router.get ('/address',tripController.trip_addr_get)

module.exports = Router