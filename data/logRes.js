import { users } from "../config/mongoCollections.js";
import * as help from "../helpers.js";
import bcrypt from "bcryptjs";
const saltRounds = 10;

export const register = async (
  firstName,
  lastName,
  email,
  password,
  phoneNumber,
  streetAddress,
  city,
  state,
  orders,
  postalCode
) => {
  //validation

  help.validateString(firstName, 3, 25);
  help.validateString(lastName, 1, 25);
  help.validateString(password, 7, 40);
  help.validateString(streetAddress, 6, 30);
  help.validateString(city, 4, 20);
  help.validateString(postalCode, 2, 6);

  help.validateEmail(email);
  help.validatePassword(password);
  help.validState(state);
  help.validatePhone(phoneNumber);
  let userDetails = await users();

  const emailExists = await userDetails.findOne({ email: email });
  if (emailExists) {
    const acct = "Email address Exists already";
    throw {
      code: 400,
      error: `Email address exits already so provide a new email`,
    };
  }
  const phoneDetailsExists = await userDetails.findOne({
    phoneNumber: phoneNumber,
  });
  if (phoneDetailsExists) {
    const acct = "Phone Number Exists already";
    throw {
      code: 400,
      error: `Phone Number exits already so provide a new number`,
    };
  }

  //insertion into db
  let address = {
    streetAddress: streetAddress,
    city: city,
    state: state,
    postalCode: postalCode,
  };

  let hashedPassword = await bcrypt.hash(password, saltRounds);
  let newUserDetails = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    phoneNumber: phoneNumber,
    password: hashedPassword,
    address: address,
    orders: orders,
    role: "user", //change in db to make admin
  };
  const insertAcct = await userDetails.insertOne(newUserDetails);
  if (!insertAcct.acknowledged || !insertAcct.insertedId) {
    throw { code: 400, error: "Could not add the details for the  account" };
  }
  const newAcctId = insertAcct.insertedId;
  const detailsAct = await userDetails.findOne({ _id: newAcctId });
  detailsAct._id = detailsAct._id.toString();
  return detailsAct;
};

export const login = async (email, password) => {
  email = await help.validateEmail(email);
  password = await help.validatePassword(password);
  const userData = await users();
  let userRecord = await userData.findOne({ email: email });
  if (!userRecord) {
    throw {
      code: 400,
      error: "Either the email address or password is invalid",
    };
  }
  let matchPwd = await bcrypt.compare(password, userRecord.password);
  if (!matchPwd) {
    throw {
      code: 400,
      error: "Either the email address or password is invalid",
    };
  }
  return userRecord;
};

// let userreg = await register(
//   "Rivaldo",
//   "Dsilva",
//   "rivaldodsilva8@gmail.com",
//   "12345Zxcv!",
//   "2019688629",
//   "240 sip ave jersey city",
//   "jersey city",
//   "NJ",
//   [],
//   "07306"
// );

let logintry = await login("rivaldodsilva8@gmail.com", "12345Zxcv!");

console.log(logintry);
