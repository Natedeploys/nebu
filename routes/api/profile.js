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

// @route:       POST api/profile
// @description: Create or edit user profile
// @access:      Private

// Protect route using passport.authenticate and jwt
router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  // Get fields 
  const profileFields = {};

  // Get the user
  profileFields.user = req.user.id;

  // Check if a handle was sent in by the form, profile unique url
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

  // Skills - split into an array
  if (typeof req.body.skills !== "undefined") {
    profileFields.skills = req.body.skills.split(',');
  }

  // Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  // Lets look for the user
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      if (profile) {
        // Update the profile, not create a new one
        Profile.findOneAndUpdate({
          user: req.user.id,
        }, {
          $set: profileFields
        }, {
          new: true
        }).then(profile => res.json(profile)); // Return the updated profile
      } else {
        // Check if handler exists this is our URL
        Profile.findOne({
            handle: profileFields.handle
          })
          .then(profile => {
            if (profile) {
              errors.handle = 'That handle already exists';
              res.status(400).json(errors);
            }

            // If a handler is free, create and return profile
            new Profile(profileFields).save()
              .then(profile => {
                res.json(profile);
              })

          })

      }
    })

});


module.exports = router;