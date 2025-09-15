
const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[A-Z]/) || !value.match(/[a-z]/) || !value.match(/[!@#$%^&*(),.?":{}|<>]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number and 1 uppercase and 1 special character');
  }
  return value;
};

const customToDate = (value, helpers) => {
  const input = value.toString();

  // Check if the input contains a time component
  const hasTime = input.includes(':');

  // Parse the date
  const date = new Date(value);

  if (!hasTime) {
    // If no time component, add one day
    date.setDate(date.getDate() + 1);
    date.setMilliseconds(date.getMilliseconds() - 1);
  }

  return date; // Return the adjusted date
}

module.exports = {
  objectId,
  password,
  customToDate,
};
