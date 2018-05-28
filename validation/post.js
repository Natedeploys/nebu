const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  if (!Validator.isLength(data.text, {
      min: 1,
      max: 400
    })) {
    errors.text = "Post must be between 1 and 400 Characters"
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required"
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