const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // If condition does not match, then set an error in
  // the empty object
  if (!Validator.isLength(data.name, {
      min: 2,
      max: 30
    })) {
    errors.name = 'Name must be between 2 and 30 characters'
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