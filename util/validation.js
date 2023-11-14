function isEmpty(value) {
  return !value || value.trim() === '';
}

function isValidRollNumber(rollNumber) {
  return !isEmpty(rollNumber) && rollNumber.includes('/');
}

function userCredentialsAreValid(username, password) {
  return !isEmpty(username) && !isEmpty(password) && password.trim().length >= 6;
}

function userDetailsAreValid(name, rollNumber, username, password) {
  return (
    !isEmpty(name) &&
    isValidRollNumber(rollNumber) &&
    userCredentialsAreValid(username, password)
  );
}

module.exports = {
  userDetailsAreValid: userDetailsAreValid,
};
