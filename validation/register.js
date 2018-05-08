const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = isEmpty(data.name) ? data.name : '';
  data.email = isEmpty(data.email) ? data.email : '';
  data.password = isEmpty(data.password) ? data.password : '';
  data.password2 = isEmpty(data.password2) ? data.password2 : '';

  // If name is not empty but less than 2 or over 30 chars
  if (!Validator.isLength(data.name, {
      min: 2,
      max: 30
    })) {
    errors.name = 'Name must be between 2 and 30 characters'
  }

  // Check whether data.name is empty
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required"
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required"
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid"
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required"
  }

  if (Validator.isLength(data.password, {
      min: 6,
      max: 30
    })) {
    errors.password = "Password must be at least 6 characters"
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field is required"
  }

  if (Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match"
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