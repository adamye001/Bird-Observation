const passport = require('passport')
const express = require('express')
const Router = express.Router()
const { body, validationResult, check } = require('express-validator')

const Controller = require('../controllers/Controller')
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
            res.redirect('/')
        }
    }
}

Router.get('/',(req,res) =>{res.render('homepage')})
Router.get('/login', (req,res) =>{

    res.render('login', { flash: req.flash('error'), title: 'Login' })
})
Router.get('/map', isAuthenticated, Controller.sendmapdata)

Router.get('/homepage', (req,res) =>{res.render('homepage')})

Router.get('/addnewaddress',isAuthenticated,Controller.sendaddressdata)

Router.get('/bio',(req,res) =>{res.render('bio')})

Router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req,res)=>{
    session = req.session;
    console.log('user ' + req.user.username + ' logged in with role ' + req.user.role);//debug need to remove when deploying
    res.redirect('/map');
})


Router.get('/login', (req, res) => {

    res.render('login', { flash: req.flash('error'), title: 'Login' })
})


Router.post('/addnewaddress',isAuthenticated, Controller.addnewaddress)



Router.get('/birdmanagement',isAuthenticated, Controller.sendallbird)
Router.get('/tripmanagement',isAuthenticated, Controller.sendalltrip)
Router.get('/birddisplay',isAuthenticated, (req, res) => {

    res.render('birddisplay')
})
Router.get('/locationdisplay/:address_id/:month/:day/:year',isAuthenticated, Controller.locationdisplay2)
Router.get('/locationdisplay/:address_id',isAuthenticated, Controller.locationdisplay)

Router.get('/birddisplay/:name',isAuthenticated, Controller.getbird)
Router.get('/xd', Controller.addbird)

Router.get('/birdmanagement/search',isAuthenticated, Controller.birdsearch)
Router.post("/birdmanagement/delete",isAuthenticated, Controller.deletebird)
Router.get('/addnewbird/modify',isAuthenticated, Controller.birdmodify)
Router.get("/tripmanagement/search",isAuthenticated, Controller.tripsearch)
Router.get("/addnewtrip/modify",isAuthenticated, Controller.tripmodify)
Router.post("/tripmanagement/delete",isAuthenticated, Controller.deletetrip)
Router.post("/addnewtrip/modify",isAuthenticated, Controller.addtrip)
Router.post("/addnewtrip",isAuthenticated, Controller.addtrip)
module.exports = Router