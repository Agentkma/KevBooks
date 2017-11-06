const express = require('express');
const router = express.Router();
const User = require('../models/users');
const mid = require('../middleware');

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET / profile
router.get('/profile', mid.requiresLogin, function(req, res, next) {


  //get info if session.userId in place
  User.findById(req.session.userId)
    .exec(function (error, user){
        if (error){
            return next(error);
        }
        else {
            return res.render('profile', {title: 'Profile', name: user.name, favorite: user.favoriteBook});
        }
    })
});


// GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});


// GET /login
router.get('/login', function(req, res, next) {
  return res.render('login', {title: 'Login'});
});

// POST /login
router.post('/login', function(req, res, next) {
  if (req.body.email && req.body.password) {
      User.authenticate(req.body.email, req.body.password, function (error, user){
          if (error || !user){
              let error = new Error ('Wrong email or password.');
              error.status = 401;
              return next(error);
          }
          else {
              // session id assiged to user while logged in
                //._id is mongo generated unique id created upon new user insertion into db
              req.session.userId = user._id;
              return res.redirect('./profile');
          }
      })

  }

  else {
  let error = new Error('Email and password are required.');
  error.status = 401;
  return next(error);
}
});

// GET /register
router.get('/register', function(req, res, next) {
  return res.render('register', {title: 'Sign Up'});
});

// POST /register
router.post('/register', function(req, res, next) {
    // check that all  form fields have values
  if (req.body.email &&
      req.body.name &&
      req.body.favoriteBook &&
      req.body.password &&
      req.body.confirmPassword) {
          // confirm password and confirmPassword match

          if (req.body.password != req.body.confirmPassword) {
              let error = new Error("Passwords Do Not Match.");
            //   400 = bad request
              error.status= 400;
              return next(error);
          }

        //   create object with form input
        let userData = {
            email: req.body.email,
            name: req.body.name,
            favoriteBook: req.body.favoriteBook,
            password: req.body.password
        };

        //use schema's create method to insert into db
        User.create(userData, function (error, user){
            if (error){
                return next(error);
            }
            else {
                // once registered user is auto loggedIn
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        })
  }
  else {
      let error = new Error("All Fields Required.");
    //   400 = bad request
      error.status= 400;
      return next(error);
  }
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
