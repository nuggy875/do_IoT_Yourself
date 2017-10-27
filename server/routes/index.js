var express = require('express');
var router = express.Router();
var passport = require('passport');
var gravatar = require('gravatar');
var Connects = require('../models/connects');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('intro', { title: 'DO IOT YOURSELF' });
});


router.get('/home', hasAuthorization, function(req, res) {
    // List all connects and sort by Date
    Connects.find().sort('-created').populate('user', 'local.email').exec(function(error, connects) {
        if (error) {
            return res.send(400, {
                message: error
            });
        }
        // Render result
        res.render('index', {
            title: 'Do IoT Yourself',
            connects: connects,
            gravatar: gravatar.url(connects.email ,  {s: '80', r: 'x', d: 'retro'}, true)
        });
    });
});



/* Create connects */
router.post('/home', function(req, res) {
    // create a new instance of the Connects model with request body
    var connects = new Connects(req.body);
    // Set current user (id)
    connects.user = req.user;
    // save the data received
    connects.save(function(error) {
        if (error) {
            return res.send(400, {
                message: error
            });
        }
        // Redirect to connects
        res.redirect('/home');
    });
});

/* Get comment by */
router.get('/home/:commentId', function(req, res, id) {
    // Get Comment by id
    connects.findById(req.params.connectId, function(err, connect) {
        if (err)
            res.send(err);
        res.json(connect);
    });
});

// Check authorization
function hasAuthorization(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};






router.get('/login',function(req,res,next){
  res.render('login', { title: 'Login', message: req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login', {
    //Success go to Profile Page / Fail go to login page
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
}));

router.get('/signup',function(req,res,next){
  res.render('signup', { title: 'Sign Up', message: req.flash('signupMessage')});
});

router.post('/signup', passport.authenticate('local-signup', {
    //Success go to Profile Page / Fail go to Signup page
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
}));

router.get('/profile', isLoggedIn, function(req, res, next) {
    res.render('profile', { title: 'Profile Page', user : req.user, avatar: gravatar.url(req.user.email ,  {s: '100', r: 'x', d: 'retro'}, true) });
});

/* check if user is logged in */
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}
/* GET Logout Page */
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/home');
});


module.exports = router;
