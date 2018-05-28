const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Import our models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// Validation for post
const validatePostInput = require('../../validation/post');

router.get('/test', (req, res) => {
  res.json({
    msg: "posts works"
  });
});

// @route   GET api/posts/
// @desc    GET posts
// @access  public
router.get('/', (req, res) => {
  Post.find()
    .sort({
      date: -1 // Returns sorted by date
    })
    .then(posts => {
      res.json(posts);
    }).catch(err => res.status(404));
});

// @route   GET api/posts/:id
// @desc    GET post by id
// @access  public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      res.json(post);
    }).catch(err => res.status(404).json({
      nopostfound: "No post found with that id"
    }));
});

// @route   POST api/posts/
// @desc    Create posts
// @access  Private
router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  const {
    errors,
    isValid
  } = validatePostInput(req.body);

  // Check validation
  if (!isValid) {
    // If any errors send 400 with errors object
    return res.status(400).json(errors)
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post => {
    res.json(post);
  });
});

// @route   DELETE api/posts/:id
// @desc    Delete the post
// @access  Private

router.delete('/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      Post.findById(req.params.id).then(
        post => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
              notauthorized: "User not authorized"
            });
          }

          post.remove().then(() => {
            res.json({
              success: true
            });
          }).catch(err => res.status(404).json({
            postnofound: "No post found"
          }));
        }
      )
    })
});

// @route   POST api/posts/like/:id
// @desc    Like the post
// @access  Private

router.post('/like/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      Post.findById(req.params.id).then(
        post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            res.status(400).json({
              alreadyliked: "User already liked this post"
            })
          }

          // Add the user ID to the likes array
          post.likes.unshift({
            user: req.user.id
          });

          post.save().then(post => {
            res.json(post)
          });
        }
      )
    }).catch(err => res.status(404).json({
      posterror: "Something went wrong"
    }))
});

// @route   POST api/posts/unlike/:id
// @desc    Unlike the post
// @access  Private

router.post('/unlike/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      Post.findById(req.params.id).then(
        post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            res.status(400).json({
              notliked: "You have not yet liked this post"
            })
          }

          // Remove the user ID to the likes array
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice it out of the array
          post.likes.splice(removeIndex, 1);

          // Save
          post.save().then(post => res.json(post))
        }
      )
    }).catch(err => res.status(404).json({
      posterror: "Something went wrong"
    }))
});

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    const {
      errors,
      isValid
    } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to comments array
        post.comments.unshift(newComment);

        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({
        postnotfound: 'No post found'
      }));
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment from post
// @access  Private

router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {

    Post.findById(req.params.id)
      .then(post => {

        // Check to see if comment exist
        if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
          return res.status(404).json({
            commentnotexists: "The comment does not exist"
          })
        }

        // Get removeindex
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        //Make sure only the comment owner can delete comment
        if (req.user.id !== post.comments[removeIndex].user.toString()) {
          return res.status(401).json({
            notauthorized: "User not authorized"
          });
        }

        // Remove from arrax
        post.comments.splice(removeIndex, 1);

        // Save the comments in that post now
        post.save().then(post => res.json(post));

      })
      .catch(err => res.status(404).json({
        postnotfound: 'No post found'
      }));
  }
);

module.exports = router;