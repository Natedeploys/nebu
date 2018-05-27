const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (Validator.isEmpty(data.school)) {
    errors.school = "School field is required"
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = "Degree field is required"
  }

  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "Field of study field is required"
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