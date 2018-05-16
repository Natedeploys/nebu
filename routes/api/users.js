const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load our user model
const User = require('../../models/User');

/*
// @route:       GET api/users/current
// @description: Current users route
// @access:      Public
router.get('/current', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  const errors = {}

  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    }).catch(err => res.status(400).json(err));

});
*/

// @route:       POST api/users/register
// @description: Register user
// @access:      Public
router.post('/register', (req, res) => {

  // from the function grab errors and isValid
  const {
    errors,
    isValid
  } = validateRegisterInput(req.body);

  // if isValid is false, then an error must have occured
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Check with Mongoose within MongoDB
  // If the email already exists
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (user) {
        errors.email = "Email already exist";
        return res.status(400).json(errors);
      } else {
        // Grab the gravatar of the user
        const avatar = gravatar.url(req.body.email, {
          s: '200', // Size,
          r: 'pg', // Rating,
          d: 'mm' // Default picture if none
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar: avatar,
          password: req.body.password
        });

        // Encrypt our password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              throw err
            };
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          })
        })
      }
    })
});

// @route:       POST api/users/register
// @description: Login User / Return Token
// @access:      Public
router.post('/login', (req, res) => {
  // from the function grab errors and isValid
  const {
    errors,
    isValid
  } = validateLoginInput(req.body);

  // if isValid is false, then an error must have occured
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find the user by email
  User.findOne({
      email: email
    })
    .then(user => {
      // Check for user
      if (!user) {
        errors.email = "User not found";
        // Return not found status and json error 
        return res.status(404).json(errors);
      }

      // Check and compare password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // User matched
            // Create JWT payload
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            }
            // Sign token
            // Then send it
            jwt.sign(
              payload,
              keys.SecretOrKey, {
                expiresIn: 36000
              }, (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              });
          } else {
            errors.password = "Password incorrect";
            return res.status(400).json(errors)
          }
        })
    });
});

// @route:       GET api/users/current
// @description: Return current user
// @access:      Private
router.get('/current', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  })
})


module.exports = router;