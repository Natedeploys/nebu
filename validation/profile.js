const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  // If it comes in as null or undefined it gets set to an empty string
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  // If is not the correct handle length, then set error
  if (!Validator.isLength(data.handle, {
      min: 2,
      max: 40
    })) {
    errors.handle = "Handle needs to be between 2 and 40 Characters"
  }

  // If its empty, then set error
  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Profile Handle is required"
  }

  // If its empty, then set error
  if (Validator.isEmpty(data.status)) {
    errors.status = "Status field is required"
  }

  // If its empty, then set error
  if (Validator.isEmpty(data.skills)) {
    errors.skills = "Status field is required"
  }

  // If its not empty, then do validation check
  if (!isEmpty(data.website)) {
    // If its not a correct URL for a website
    if (!Validator.isURL(data.website)) {
      errors.website = "Not a valid URL"
    }
  }

  // If its not empty, then do validation check
  if (!isEmpty(data.youtube)) {
    // If its not a correct URL for a youtube site
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = "Not a valid URL"
    }
  }

  // If its not empty, then do validation check
  if (!isEmpty(data.facebook)) {
    // If its not a correct URL for a facebook page
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "Not a valid URL"
    }
  }

  // If its not empty, then do validation check
  if (!isEmpty(data.linkedin)) {
    // If its not a correct URL for a linkedin profile
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "Not a valid URL"
    }
  }

  // If its not empty, then do validation check
  if (!isEmpty(data.twitter)) {
    // If its not a correct URL for a twitter user
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = "Not a valid URL"
    }
  }

  // If its not empty, then do validation check
  if (!isEmpty(data.instagram)) {
    // If its not a correct URL for an instagram page
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = "Not a valid URL"
    }
  }

  // If the error object is empty then no errors will be picked up by
  // isValid. Otherwise it will return that it is not empty.
  // Returning the errors object allows us to see what went wrong with the
  // data submitted.
  return {
    errors,
    isValid: isEmpty(errors)
  }
}