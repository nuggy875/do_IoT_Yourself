var express = require('express');
var router = express.Router();
var passport = require('passport');
var gravatar = require('gravatar');
var Connects = require('../models/connects');
var Users = require('../models/users');
var nodemailer = require('nodemailer');

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
function input_check(input){
  if (input === '침대누움'){
    return '[1011]';
  }
  else if (input === '침대일어남') {
    return '[1010]';
  }
  else if (input === '소파앉음') {
    return '[1021]';
  }
  else if (input === '소파일어남') {
    return '[1020]';
  }
  else if (input === '창문열음') {
    return '[1031]';
  }
  else if (input === '창문닫음') {
    return '[1030]';
  }
  else if (input === '적외선감지') {
    return '[1041]';
  }
  else if (input === '적외선미감지') {
    return '[1040]';
  }
}

function output_check(output){
  if (output === '거실등 ON'){
    return '2011';
  }
  else if (output === '거실등 OFF') {
    return '2010';
  }
  else if (output === '스탠드램프 ON') {
    return '2021';
  }
  else if (output === '스탠드램프 OFF') {
    return '2020';
  }
  else if (output === '경보기 ON') {
    return '2031';
  }
  else if (output === '경보기 OFF') {
    return '2030';
  }
  else if (output === '환풍기 ON') {
    return '2041';
  }
  else if (output === '환풍기 OFF') {
    return '2040';
  }
  else if (output === 'E-mail 전송') {
    return '0';
  }
}

router.post('/data_status', function(req, res) {
   //post방식으로 받아온 json타입에서 바디의 iotaction key의 data값을 string으로 받아옴
   // iotaction: xx
   var iot_action=req.body.iotaction
   console.log(typeof(iot_action));
  //json 배열 형태로 뽑아내 전달

  Users.find().select('local').exec(function(error, connects){
    var uEmail= connects[0].local.email;
    console.log(uEmail);
  });


  Connects.find({iotaction: iot_action},{_id: 0, iotevent: 1}) // id컬럼값을제거하고 iotevent만 남김
  .select('iotevent').sort('-created')
  .exec(function(error, connects) {
    console.log(connects);
    var iot_events = (connects);
    var emailCheck = iot_events.find((item, idx) => {
      return item.iotevent === 'E-mail 전송'
    });

   console.log(emailCheck);
    //응답이 email 제외한경우 json배열으로 이벤트전달

      console.log(iot_events);
      res.send(iot_events);
    if(emailCheck != undefined){
      var transporter = nodemailer.createTransport({
      service: "naver",
      auth: {
              user: "zx6658@naver.com",
              pass: "as960920!!"
        }
      });

      var mailOptions = {
        from: "zx6658@naver.com",
        to: "zx6658@hanmail.net",
        subject: "iot_test ",
        text: "Hello "
        };

      transporter.sendMail(mailOptions, function(error, response)
      {
        if(error){ console.log(error);
        }
        else{
          console.log("Message sent: " + response.message);
        }
        transporter.close();
        res.send(iot_events);
      });
      }
  });

});

/* Create connects */
router.post('/home', function(req, res) {
  console.log(req.body);
    // create a new instance of the Connects model with request body
    var connects = new Connects(req.body);
    console.log(connects.iotaction);
    connects.input_number = input_check(connects.iotaction);
    console.log(connects.input_number)
    connects.output_number = output_check(connects.iotevent);
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
