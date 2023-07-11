//for passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('./models/Users');

passport.serializeUser((user, done) => {
	// Use id to serialize user
	done(undefined, user._id);
});

passport.deserializeUser((userId, done) => {
	Users.findById(userId, { password: 0 }, (err, user) => {
		if (err) {
			return done(err, undefined);
		}
		return done(undefined, user);
	});
});

var strategy = new LocalStrategy(async (username, password, cb) => {
	// first, check if there is a user in the db with this username

	Users.findOne({ username: username }, {}, {}, function (err, user) {
		if (err) {
			return cb(null, false, { message: 'Unknown error.' });
		} else if (!user) {
			return cb(null, false, { message: 'Incorrect Username.' });
		}
		// if there is a user with this username, check if the password matches
		user.verifyPassword(password, (err, valid) => {
			if (err) {
				return cb(null, false, { message: 'Unknown error.' });
			} else if (!valid) {
				return cb(null, false, { message: 'Incorrect Password.' });
			}
			return cb(null, user);
		});
	});
});

passport.use(strategy);

module.exports = passport;
