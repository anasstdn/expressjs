const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
var connection = require('../libraries/database');
const crypto=require('crypto');
const customFields = {
    usernameField: 'username',
    passwordField: 'password',
};
/*Passport JS*/
const verifyCallback = (username, password, done) => {
    connection.query('SELECT * FROM users WHERE username = ? ', [username], function (error, results, fields) {
        if (error)
            return done(error);

        if (results.length == 0) {
            return done(null, false);
        }
        const isValid = validPassword(password, results[0].hash, results[0].salt);
        user = { id: results[0].id, username: results[0].username, hash: results[0].hash, salt: results[0].salt };
        if (isValid) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    });
}
const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);
passport.serializeUser((user, done) => {
    console.log("inside serialize");
    done(null, user.id)
});

passport.deserializeUser(function (userId, done) {
    console.log('deserializeUser' + userId);
    connection.query('SELECT * FROM users where id = ?', [userId], function (error, results) {
        done(null, results[0]);
    });
});

function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
    return hash === hashVerify;
}

function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genhash = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
    return { salt: salt, hash: genhash };
}


function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.redirect('/notAuthorized');
    }
}


function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin == 1) {
        next();
    }
    else {
        res.redirect('/notAuthorizedAdmin');
    }
}

function userExists(req, res, next) {
    connection.query('Select * from users where username=? ', [req.body.uname], function (error, results, fields) {
        if (error) {
            console.log("Error");
        }
        else if (results.length > 0) {
            res.redirect('/userAlreadyExists')
        }
        else {
            next();
        }

    });
}

module.exports = {
    verifyCallback,
    validPassword,
    genPassword,
    isAuth,
    isAdmin,
    userExists,
    passport
};