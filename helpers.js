// mahesh, yuzhi, kaushik: Bookings, room both routes and data functions

// sushmita, rivaldo: account, feedback, gallery both routes and data functions
import { ObjectId } from "mongodb";
import validator from "validator";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const nameRegex = /^[A-Za-z]+$/;
const prefixPattern = /^([a-zA-Z0-9]+([_\.-]?[a-zA-Z0-9]+)*)$/;
const domainPattern = /^([a-zA-Z0-9-]+)+(\.[a-zA-Z]{2,})+$/;
const UpperCase = /[A-Z]/;
const number = /[0-9]/;
const specialChar = /[^A-Za-z0-9]/;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//sushmita helpers

export const validateCardNumber = async (carrdNumber) => {
  return /^\d{16}$/.test(carrdNumber);
};

export const validateExpiryMonth = async (expiryMonth) => {
  return /^(0?[1-9]|1[012])$/.test(expiryMonth);
};
export const validateExpiryYear = async (expiryYear) => {
  const currentYear = new Date().getFullYear();
  return /^\d{4}$/.test(expiryYear) && expiryYear >= currentYear;
};
export const validateCVV = async (cvv) => {
  return /^\d{3,4}$/.test(cvv);
};
export const validateCardName = async (cardName) => {
  const trimmedName = cardName.trim();
  const nameParts = trimmedName.split(" ");
  if (nameParts.length !== 2) {
    throw { code: 400, error: "Invalid Card Name" };
  }
  if (nameParts.every((part) => /^[A-Za-z]+$/.test(part))) {
    return cardName;
  } else {
    throw { code: 400, error: "Invalid Card Name" };
  }
};

export const validatePhonePrefix = async (phonePrefix) => {
  const countryCodesPath = path.join(
    __dirname,
    "public",
    "js",
    "countryCodes.json"
  );
  const data = await fs.readFile(countryCodesPath, "utf8");
  const countryCodes = JSON.parse(data).codes;
  const validCountryCodes = countryCodes.map((code) => code.code);
  if (!validCountryCodes.includes(phonePrefix)) {
    throw { code: 400, error: "Invalid Phone Prefix Code" };
  }
  return phonePrefix;
};

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
export const validateString = async (name, min, max) => {
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw "ERROR : type must be string";
  }
  if (name.length <= min || name.length >= max) {
    //check for the name with space condßition
    throw "ERROR : string must be min maxed";
  }
};

export const validateEmail = async (emailAddress) => {
  emailAddress = emailAddress.trim().toLowerCase();
  if (!validator.isEmail(emailAddress)) {
    throw {
      code: 400,
      error: `Given email: ${emailAddress} is not in a valid email address format`,
    };
  }
  let [prefix, domain] = emailAddress.split("@");
  if (!prefixPattern.test(prefix) || !domainPattern.test(domain)) {
    throw {
      code: 400,
      error: `Given email: ${emailAddress} doesn't have a valid prefix or domain`,
    };
  }
  return emailAddress;
};

export const validatePassword = async (password) => {
  if (
    typeof password !== "string" ||
    password.includes(" ") ||
    password.length < 8
  ) {
    throw {
      code: 400,
      error: `Password must be valid String with no spaces and should be at least 8 characters long`,
    };
  }
  if (
    !UpperCase.test(password) ||
    !number.test(password) ||
    !specialChar.test(password)
  ) {
    throw {
      code: 400,
      error: `Password must contain at least one upperCase character, one number and one special character`,
    };
  }
  return password;
};

export const resetPassword = async (email, password) => {
  email = await helpers.validateEmail(email);
  password = await helpers.validatePassword(password);
  const userData = await accounts();
  const userRecord = await userData.findOne({ email: email });
  if (!userRecord) {
    throw { code: 400, error: "Not an Registered Email" };
  }
  const isPasswordMatch = await bcrypt.compare(password, userRecord.password);
  if (isPasswordMatch) {
    throw {
      code: 400,
      error:
        "New Password cannot be same as the Old Password - So provide a new password or login with old Password",
    };
  }
  let hashedPassword = await bcrypt.hash(password, saltRounds);
  const updateInfo = await userData.updateOne(
    { email: email },
    { $set: { password: hashedPassword } }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
    throw { code: 500, error: "Could not update the password" };
  }
  return { updated: true, userId: userRecord._id };
};
export const validatePhone = async (phone) => {
  if (typeof phone !== "string") {
    throw `Phone Number needs to be a string`;
  }
  if (phone.length !== 10) {
    throw { code: 400, error: `Phone Number must have exactly 10 digits` };
  }
  const phonePattern = /^\d{10}$/;
  if (!phonePattern.test(phone)) {
    throw {
      code: 400,
      error: `Phone Number must be a string of  exactly 10 digits`,
    };
  }
  return phone;
};
export const validatePhoneNumber = async (phNumber) => {
  let parts;
  if (typeof phNumber !== "string") {
    throw `Phone Number needs to be a string`;
  } else {
    if (phNumber.trim().length === 0) {
      throw `Phone NUmber cannot be just empty spaces`;
    }
    parts = phNumber.split("-");
    if (parts.length !== 3) {
      throw `Please provide a valid phone Number`;
    } else {
      if (
        parts[0].length !== 3 ||
        parts[1].length !== 3 ||
        parts[2].length !== 4
      ) {
        throw `Please provide phone number in the format 123-456-7890`;
      }
      parts.forEach((part) => {
        if (!/^[0-9]+$/.test(part)) {
          throw `It is phone number, please enter numbers in the format 123-456-7890`;
        }
      });
    }
  }
  return parts.join("");
};
export const checkIfExistsForReset = async (
  email,
  password,
  confirmPassword
) => {
  if (!email || !password || !confirmPassword) {
    throw { code: 400, error: `All fields need to have valid values` };
  }
};
export const checkIfExistsForLogin = async (email, password) => {
  if (!email || !password) {
    throw { code: 400, error: `All fields need to have valid values` };
  }
};
export const checkIfExistsForRegister = async (
  firstNameInput,
  lastNameInput,
  emailAddressInput,
  phone,
  roleInput,
  passwordInput,
  confirmPasswordInput
) => {
  if (
    !firstNameInput ||
    !lastNameInput ||
    !emailAddressInput ||
    !phone ||
    !roleInput ||
    !passwordInput ||
    !confirmPasswordInput
  ) {
    throw { code: 400, error: `All fields need to have valid values` };
  }
};
export const checkIfExistsForAccountUpdate = async (
  firstNameInput,
  lastNameInput,
  emailAddressInput,
  phonePrefix,
  phone
) => {
  if (
    !firstNameInput ||
    !lastNameInput ||
    !emailAddressInput ||
    !phonePrefix ||
    !phone
  ) {
    throw { code: 400, error: `All fields need to have valid values` };
  }
};

export const validateRole = async (roleInput) => {
  if (!["admin", "user", "staff"].includes(roleInput.toLowerCase())) {
    throw {
      code: 400,
      error: 'Role must be either "admin", "user" or "staff"',
    };
  }
  return roleInput;
};
export const validateDates = async (dateInput) => {
  if (!dateInput || typeof dateInput !== "string") {
    throw { code: 400, error: "Invalid Date Provided" };
  }
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateInput)) {
    throw {
      code: 400,
      error: "Invalid Date format as the correct format is YYYY-MM-DD",
    };
  }

  const parts = dateInput.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const currentYear = new Date().getFullYear();
  if (year < currentYear) {
    throw {
      code: 400,
      error: `Year must be ${currentYear} or only Future year`,
    };
  }
  if (month < 0 || month > 11) {
    throw { code: 400, error: "Month must be between 1 to 12" };
  }
  const date = new Date(year, month, day);
  if (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  ) {
    return dateInput;
  } else {
    throw { code: 400, error: "Invalid date" };
  }
};

export const checkCheckInAndOutDate = async (CheckinDate, CheckoutDate) => {
  let checkInDateValue = new Date(CheckinDate + "T00:00:00Z");
  let checkOutDateValue = new Date(CheckoutDate + "T00:00:00Z");
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); //reset for hrs,min,sec and mls
  let currentDateString = currentDate.toISOString().slice(0, 10);
  let checkInDateString = checkInDateValue.toISOString().slice(0, 10);
  let checkOutDateString = checkOutDateValue.toISOString().slice(0, 10);
  if (checkInDateString < currentDateString) {
    throw { code: 400, error: `Check in date must not be in the past` };
  } else if (checkInDateString === checkOutDateString) {
    throw {
      code: 400,
      error: `Check in date and Check out date cannot be same`,
    };
  } else if (checkOutDateValue < checkInDateValue) {
    throw {
      code: 400,
      error: `Check in date must be before the Check out date`,
    };
  }
};

export const checkRoomNumber = async (roomNumber) => {
  if (!roomNumber || !Number.isInteger(roomNumber)) {
    throw { code: 400, error: `Invalid Room Number expected an integer value` };
  }
  return roomNumber;
};

export const checkRoomPrice = async (roomPrice) => {
  if (!roomPrice || typeof roomPrice !== "number" || isNaN(roomPrice)) {
    throw { code: 400, error: `Invalid Room Price expected a number` };
  }
  return roomPrice;
};

export const checkRoomType = async (roomType) => {
  if (!roomType || typeof roomType !== "string") {
    throw `Room Type not provided`;
  }
  const allowedTypes = ["single", "double", "suite"];
  const trimmedRoomType = roomType.trim();
  if (!allowedTypes.includes(trimmedRoomType)) {
    throw `Invalid Room Type: Expected any one of them - single, double or suite `;
  }
  return trimmedRoomType;
};

//rivaldo helpers
// You can add and export any helper functions you want here - if you aren't using any, then you can just leave this file as is
export function checknum(num) {
  if (typeof num !== "number" || num == Infinity || isNaN(num))
    throw "ERROR : input is not a number";
}

export function checkstring(string) {
  if (typeof string != "string") throw "ERROR : input is not a string";
}

export function checkundefined(input) {
  if (input === undefined)
    throw "ERROR : input cannot be undefined or not enough inputs passed into function";
}

export function countParameters(obj) {
  let count = 0;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      count++;
    }
  }
  return count;
}

export function myArrFunc(arr) {
  /*so I'm expecting the input param to be an array, if it's anything else, I should throw an error (even if it's an object. However, if you do a typeof check on an array, it will return 'object'  which if you checked it using typeof, and an object was supplied to the function (not an array) it would get through.  so instead of checking typeof on a function that must ONLY take in an array, we should check if it's an actual array, not the type using typeof */

  if (!arr)
    throw "ERROR : Input is not supplied, is undefined, null, 0, false, '', or NaN";
  if (!Array.isArray(arr)) throw "ERROR : Invalid Input detected ";

  if (typeof obj === "object") throw "ERROR: Input must not an object!";
}

export function myObjFunc(obj) {
  if (!obj)
    throw "ERROR:  Input is not supplied, is undefined, null, 0, false, '', or NaN";
  if (Array.isArray(obj))
    throw "ERROR: Input must be an object, but an array was supplied";
  //now that I made sure it's not an array, I can check to make sure it's an object using typeof
  if (typeof obj !== "object") throw "ERROR: Input must be an object!";
}

export function justSpaces(string) {
  if (/^\s*$/.test(string)) {
    throw "ERROR : String cannot be only spaces";
  }
}

export function emptyStringCheck(string) {
  if (string.length == 0) throw "ERROR : string cannot be empty";
}

export function stringValidation(string) {
  checkundefined(string);
  checkstring(string);
  emptyStringCheck(string);
  justSpaces(string);
}

export function numberValidation(num) {
  checkundefined(num);
  checknum(num);
  justSpaces(num);
}

export function validMonth(month) {
  let vmonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  if (!vmonths.includes(month)) {
    throw "ERROR : month is not valid";
  }
  return true;
}

export function validDay(month, day) {
  let months31Days = [1, 3, 5, 7, 8, 10, 12];
  let months30Days = [4, 6, 9, 11];
  let months28Days = [2];
  let valid31days = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];
  let valid30days = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30,
  ];
  let valid28days = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28,
  ];

  if (months31Days.includes(month)) {
    if (!valid31days.includes(day)) {
      throw "ERROR : day is not valid";
    }
  }

  if (months30Days.includes(month)) {
    if (!valid30days.includes(day)) {
      throw "ERROR : day is not valid";
    }
  }

  if (months28Days.includes(month)) {
    if (!valid28days.includes(day)) {
      throw "ERROR : day is not valid";
    }
  }
}

export function minStringLength(string, name, min) {
  if (string.length < min)
    throw "ERROR :  " + name + " cannot be less than " + min + " characters";
}

export function ValidEmail(email) {
  let emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(email))
    throw "ERROR : Email is not in a valid email address format";
}

export function validDate(date) {
  let dateFormatRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  if (!dateFormatRegex.test(date))
    throw "ERROR : eventDate is not in a valid date format";
}

export function validTime(time) {
  let timeFormatRegex = /^([1-9]|1[0-2]):[0-5][0-9] [AP][M]$/;
  // Check if the time format matches
  if (!timeFormatRegex.test(time))
    throw "ERROR : time is not is not in a valid time format";
}

export function validMinutes(minutes) {
  if (minutes < 0 || minutes > 59) throw "ERROR : Minutes is not valid";
}
export function validHours(hours) {
  if (hours < 0 || hours > 12) throw "ERROR : Hours is not valid";
}

export function sTimeBeforeETime(
  shours,
  sminutes,
  smeridiem,
  ehours,
  eminutes,
  emeridiem
) {
  let tstime;
  let tetime;
  let shrstomins = shours * 60;
  let ehrstomins = ehours * 60;
  if (smeridiem == "PM" || smeridiem == "pm") {
    shrstomins += 720;
    tstime = shrstomins + sminutes;
  } else {
    tstime = shrstomins + sminutes;
  }

  if (emeridiem == "PM" || emeridiem == "pm") {
    ehrstomins += 720;
    tetime = ehrstomins + eminutes;
  } else {
    tetime = ehrstomins + eminutes;
  }

  if (tstime > tetime) throw "ERROR : start time cannot be later than end time";

  if (tetime < tstime)
    throw "ERROR : end time cannot be earlier than start time";

  if (tetime < tstime + 30)
    throw "ERROR : end time cannot be less than 30 minutes afte start time";
}

export function booleanValidation(bool) {
  if (!(typeof bool === "boolean"))
    throw "ERROR : publicEvent is not a boolean";
}

export function validState(state) {
  let stateAbbreviationRegex = /^[A-Z]{2}$/;

  if (!stateAbbreviationRegex.test(state))
    throw "ERROR : state must be a valid two character state abbreviation";
}

export function validZip(zip) {
  stringValidation(zip);
  minStringLength(zip, "zip", 5);
  maxStringLength(zip, "zip", 5);

  if (!/^\d+$/.test(zip)) {
    throw "zip must contain only a string of 5 NUMBERS";
  }
}

export function maxStringLength(string, name, max) {
  if (string.length > max)
    throw "ERROR :  " + name + " cannot be more than " + max + " characters";
}

export function validRating(rating) {
  rating = parseInt(rating);
  numberValidation(rating);
  if (rating > 10) {
    throw "ERROR :  " + rating + " cannot be more than 10";
  }
  if (rating < 0) {
    throw "ERROR :  " + rating + " cannot be less than 0";
  }
}

export function isAdmin(object) {
  if (object.isAdmin == true) {
    return true;
  } else return false;
}

export const checkId = async (id, varName) => {
  if (!id) throw `Error: You must provide a ${varName}`;
  if (typeof id !== "string") throw `Error:${varName} must be a string`;

  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
  return id;
};

/* BOOKING.js DATA FUNCTON ERROR HANDLING */

/* BOOKING.js DATA FUNCTON ERROR HANDLING */

/*     BookingId,
    firstName,
    lastName,
    emailId,
    contactNumber,
    BookingDate,
    CheckinDate,
    CheckOutDate,
    BookingStatus */

export const BookFirstName = async (firstName) => {
  if (!firstName) throw `Error: you must provide a first name`;
  if (typeof firstName !== "string") {
    throw `Enter Valid String Input`;
  }
  if (firstName.trim() === "")
    throw `Error: Provided first name is empty try again`;
  firstName.trim();
  firstName.toLowerCase();
  if (firstName.length < 2)
    throw `Error: last name should have more than one character in it`;
  let Symbol_check = [
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "_",
    "+",
    "=",
    "-",
    "[",
    "]",
    "{",
    "}",
    ";",
    ":",
    "<",
    ">",
    "?",
    "/",
  ];
  let Numerical_check = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  for (let i of firstName) {
    if (Symbol_check.includes(i))
      throw `Error: Input first name has invalid symbol in it please enter first name again`;
  }
  for (let j of firstName) {
    if (Numerical_check.includes(j))
      throw `Error: Input First Name has a number in it please enter name again`;
  }
  return firstName;
};

export const BookLastName = async (lastName) => {
  if (typeof lastName !== "string")
    throw `Error: Provided last name is not a string`;
  if (lastName.trim() === "")
    throw `Error: Provided last name is empty try again`;
  lastName.trim();
  lastName.toLowerCase();
  if (lastName.length < 2)
    throw `Error: last name should have more than one character in it`;
  let Symbol_check = [
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "_",
    "+",
    "=",
    "-",
    "[",
    "]",
    "{",
    "}",
    ";",
    ":",
    "<",
    ">",
    "?",
    "/",
  ];
  let Numerical_check = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  for (let i of lastName) {
    if (Symbol_check.includes(i))
      throw `Error: Input last name has invalid symbol in it please enter first name again`;
  }
  for (let j of lastName) {
    if (Numerical_check.includes(j))
      throw `Error: Input last Name has a number in it please enter name again`;
  }
  return lastName;
};

export const BookEmailId = async (emailId) => {
  if (typeof emailId !== "string")
    throw `Error: Provided email is not a string`;
  if (emailId.trim() === "")
    throw `Error: Provided first name is empty try again`;
  emailId.trim();
  emailId.toLowerCase();
  const EmailIdRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!EmailIdRegex.test(emailId))
    throw `Error: Invalid email address please try again`;
  return emailId;
};

export const BookContactNumber = async (contactNumber) => {
  if (typeof contactNumber !== "string")
    throw `Error: Provided contact is not a string`;
  if (contactNumber.trim() === "")
    throw `Error: Provided first name is empty try again`;
  contactNumber.trim();
  contactNumber.toLowerCase();
  let ContactRegex = /^\d{10}$/;
  if (!ContactRegex.test(contactNumber))
    throw `Error: Please enter valid contact number`;
  return contactNumber;
};

export function validateRoomData(roomData) {
  const roomNumber = parseInt(roomData.roomNumber, 10);
  if (isNaN(roomNumber) || roomNumber <= 0) {
    throw new Error(
      "Invalid room number: must be a non-empty positive integer"
    );
  }

  const roomType = roomData.roomType;
  if (typeof roomType !== "string" || roomType.trim() === "") {
    throw new Error("Invalid room type: must be a non-empty string");
  }

  const roomPrice = parseFloat(roomData.roomPrice);
  if (isNaN(roomPrice) || roomPrice <= 0) {
    throw new Error("Invalid room price: must be a non-empty positive number");
  }

  const availability = roomData.availability;
  if (typeof availability !== "boolean") {
    throw new Error("Invalid availability: must be a boolean value");
  }

  const roomDescription = roomData.roomDescription;
  if (typeof roomDescription !== "string" || roomDescription.trim() === "") {
    throw new Error("Invalid room description: must be a non-empty string");
  }
}

export function validateRoomNumber(roomNumber) {
  if (roomNumber === null || roomNumber === undefined || roomNumber === "") {
    throw new Error("Room number cannot be empty");
  }

  const number = parseInt(roomNumber, 10);

  if (isNaN(number) || number <= 0) {
    throw new Error(
      "Invalid room number: Must be a non-empty positive integer"
    );
  }
}
