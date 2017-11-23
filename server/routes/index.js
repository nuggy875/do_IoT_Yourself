var express = require('express');
var router = express.Router();
var passport = require('passport');
var gravatar = require('gravatar');
var Connects = require('../models/connects');
var Users = require('../models/users');
var nodemailer = require('nodemailer');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('intro', { title: 'DO IOT YOURSELF' });
});

router.get('/delete/:id', function(req, res){
    console.log(req.params.id);
    Connects.remove({ _id : req.params.id }, function(err){
        res.redirect('/home');
    });
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
/*
hardware에서 데이터를 받아 그에맞는 event처리
*/

/*
router.post('/', function(req, res) {
    	console.log(req);
  	var buf = '';
        req.setEncoding('utf8');
	req.on('data', function(chunk){ buf += chunk });
	req.on('end', function() {
 	req.rawBody = buf;
	res.send(req.rawBody);
	});
});
*/
function input_check(input,input2,input3,input4){
  if (input === '침대 일어남' && input2 === '현관문 열림' && input3 === '광센서 낮' && input4 === '소파 일어남'){
    return '[111@]';
  }
  else if (input === '침대 일어남' && input2 === '현관문 열림' && input3 === '광센서 낮' && input4 === '소파 앉음') {
    return '[111A]';
  }
  else if (input === '침대 일어남' && input2 === '현관문 열림' && input3 === '광센서 밤' && input4 === '소파 일어남') {
    return '[111B]';
  }
  else if (input === '침대 일어남' && input2 === '현관문 열림' && input3 === '광센서 밤' && input4 === '소파 앉음') {
    return '[111C]';
  }
  else if (input === '침대 일어남' && input2 === '현관문 닫힘' && input3 === '광센서 낮' && input4 === '소파 일어남') {
    return '[111D]';
  }
  else if (input === '침대 일어남' && input2 === '현관문 닫힘' && input3 === '광센서 낮' && input4 === '소파 앉음') {
    return '[111E]';
  }
  else if (input === '침대 일어남' && input2 === '현관문 닫힘' && input3 === '광센서 밤' && input4 === '소파 일어남') {
    return '[111F]';
  }
  else if (input === '침대 일어남' && input2 === '현관문 닫힘' && input3 === '광센서 밤' && input4 === '소파 앉음') {
    return '[111G';
  }
  else if (input === '침대 누움' && input2 === '현관문 열림' && input3 === '광센서 낮' && input4 === '소파 일어남') {
    return '[111H]';
  }
  else if (input === '침대 누움' && input2 === '현관문 열림' && input3 === '광센서 낮' && input4 === '소파 앉음') {
    return '[111I]';
  }
  else if (input === '침대 누움' && input2 === '현관문 열림' && input3 === '광센서 밤' && input4 === '소파 일어남') {
    return '[111G]';
  }
  else if (input === '침대 누움' && input2 === '현관문 열림' && input3 === '광센서 밤' && input4 === '소파 앉음') {
    return '[111K]';
  }
  else if (input === '침대 누움' && input2 === '현관문 닫힘' && input3 === '광센서 낮' && input4 === '소파 일어남') {
    return '[111L]';
  }
  else if (input === '침대 누움' && input2 === '현관문 닫힘' && input3 === '광센서 낮' && input4 === '소파 앉음') {
    return '[111M]';
  }
  else if (input === '침대 누움' && input2 === '현관문 닫힘' && input3 === '광센서 밤' && input4 === '소파 일어남') {
    return '[111N]';
  }
  else if (input === '침대 누움' && input2 === '현관문 닫힘' && input3 === '광센서 밤' && input4 === '소파 앉음') {
    return '[111O]';
  }
}

function output_check(output,output2,output3,output4){
  if (output === '현관문조명 OFF' && output2 === '스탠드램프 OFF' && output3 === '경보기 OFF' && output4 === '환풍기 OFF'){
    return '222@';
  }
  else if (output === '현관문조명 OFF' && output2 === '스탠드램프 OFF' && output3 === '경보기 OFF' && output4 === '환풍기 ON') {
    return '222A';
  }
  else if (output === '현관문조명 OFF' && output2 === '스탠드램프 OFF' && output3 === '경보기 ON' && output4 === '환풍기 OFF') {
    return '222B';
  }
  else if (output === '현관문조명 OFF' && output2 === '스탠드램프 OFF' && output3 === '경보기 ON' && output4 === '환풍기 ON') {
    return '222C';
  }
  else if (output === '현관문조명 OFF' && output2 === '스탠드램프 ON' && output3 === '경보기 OFF' && output4 === '환풍기 OFF') {
    return '222D';
  }
  else if (output === '현관문조명 OFF' && output2 === '스탠드램프 ON' && output3 === '경보기 OFF' && output4 === '환풍기 ON') {
    return '222E';
  }
  else if (output === '현관문조명 OFF' && output2 === '스탠드램프 ON' && output3 === '경보기 ON' && output4 === '환풍기 OFF') {
    return '222F';
  }
  else if (output === '현관문조명 OFF' && output2 === '스탠드램프 ON' && output3 === '경보기 ON' && output4 === '환풍기 ON') {
    return '222G';
  }
  else if (output === '현관문조명 ON' && output2 === '스탠드램프 OFF' && output3 === '경보기 OFF' && output4 === '환풍기 OFF') {
    return '222H';
  }
  else if (output === '현관문조명 ON' && output2 === '스탠드램프 OFF' && output3 === '경보기 OFF' && output4 === '환풍기 ON') {
    return '222I';
  }
  else if (output === '현관문조명 ON' && output2 === '스탠드램프 OFF' && output3 === '경보기 ON' && output4 === '환풍기 OFF') {
    return '222G';
  }
  else if (output === '현관문조명 ON' && output2 === '스탠드램프 OFF' && output3 === '경보기 ON' && output4 === '환풍기 ON') {
    return '222K';
  }
  else if (output === '현관문조명 ON' && output2 === '스탠드램프 ON' && output3 === '경보기 OFF' && output4 === '환풍기 OFF') {
    return '222L';
  }
  else if (output === '현관문조명 ON' && output2 === '스탠드램프 ON' && output3 === '경보기 OFF' && output4 === '환풍기 ON') {
    return '222M';
  }
  else if (output === '현관문조명 ON' && output2 === '스탠드램프 ON' && output3 === '경보기 ON' && output4 === '환풍기 OFF') {
    return '222N';
  }
  else if (output === '현관문조명 ON' && output2 === '스탠드램프 ON' && output3 === '경보기 ON' && output4 === '환풍기 ON') {
    return '222O';
  }
}


/* Create connects */
router.post('/home', function(req, res) {
  console.log(req.body);
    // create a new instance of the Connects model with request body
    var connects = new Connects(req.body);
    connects.input_number = input_check(connects.iotaction,connects.iotaction2,connects.iotaction3,connects.iotaction4);
    connects.output_number = output_check(connects.iotevent,connects.iotevent2,connects.iotevent3,connects.iotevent4);
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
