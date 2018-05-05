const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// Load our user model
const User = require('../../models/User');

// @route:       GET api/users/test
// @description: Tests users route
// @access:      Public
router.get('/test', (req, res) => {
  res.json({
    msg: "users works"
  });
});

// @route:       POST api/users/register
// @description: Register user
// @access:      Public
router.post('/register', (req, res) => {
  // Check with Mongoose within MongoDB
  // If the email already exists
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (user) {
        return res.status(400).json({
          email: "Email already exist"
        });
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


module.exports = router;