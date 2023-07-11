// Import express
const express = require('express')
process.env.TZ = 'AEST'
    // Set your app up as an express app
const app = express()
var Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
app.use(express.json()) // needed if POST data is in JSON format

app.use(express.static('public')) // define where static assetslive
app.use(express.urlencoded({ extended: false }))
const helper = require('./helpers/helper');
const flash = require('express-flash')
const session = require('express-session')
    // Flash messages for failed logins, and (possibly) other success/error messages
app.use(flash())
    // include Handlebars module

var hbs = exphbs.create({
    helpers: helper,
    defaultlayout: 'main',
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),

})
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

app.engine(
    
    '.hbs',
    hbs.engine

)
app.set('view engine', 'hbs') // set Handlebars view engine



app.use(
    session({
        // The secret used to sign session cookies (ADD ENV VAR)
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        name: 'patient', // The cookie name (CHANGE THIS)
        saveUninitialized: false,
        resave: false,
        proxy: process.env.NODE_ENV === 'production', //  to work on Heroku
        cookie: {
            sameSite: 'strict',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3000000 // sessions expire after 5 minutes
        },
    })
)




// Initialise Passport.js
const passport = require('./passport')
app.use(passport.authenticate('session'))
const mongoClient = require('./models/db.js')











const Router = require('./routes/Router')
const birdRouter = require('./routes/birdrouter')
const tripRouter = require('./routes/Triprouter')

app.use((req, res, next) => {
    console.log('message arrived: ' + req.method + ' ' + req.path)
    next()
})

app.use('/', Router)
app.use('/addnewbird',birdRouter)
app.use('/addnewtrip',tripRouter)





// Track authenticated users through login sessions

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // Trust first proxy
}



app.listen(process.env.PORT || 3000, () => {
    console.log('App is listening for requests')
})