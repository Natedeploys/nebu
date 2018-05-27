const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (Validator.isEmpty(data.title)) {
    errors.title = "Job Title field is required"
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = "Company field is required"
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "From date field is required"
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