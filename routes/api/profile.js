const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load profile model 
const Profile = require('../../models/Profile');
// Load user profile 
const User = require('../../models/User');

// @route:       GET api/profile
// @description: Get current users profile
// @access:      Private

// Protect route using passport.authenticate and jwt
router.get('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const errors = {};

  Profile.findOne({ // find a profile based on user id
      user: req.user.id
    })
    .then(profile => {
      if (!profile) { // If there is no profile
        errors.noprofile = "There is no profile for this user";
        return res.status(400).json(errors);
      }
      // If there is a profile, send 200 response with profile
      res.json(profile)
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;