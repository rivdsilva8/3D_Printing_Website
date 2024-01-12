import { Router } from "express";
const router = Router();
import * as help from "../helpers.js";
import { login, register } from "../data/logRes.js";
import xss from "xss";

router
  .route("/login")
  .get(async (req, res) => {
    return res.render("../views/login", { title: "Login" });
  })
  .post(async (req, res) => {
    const { email, password } = req.body;
    try {
      await help.checkIfExistsForLogin(email, password);
      const emailAddress = await help.validateEmail(email);
      const passwordGiven = await help.validatePassword(password);
      const emailCheck = xss(emailAddress);
      const passwordCheck = xss(passwordGiven);
      const loginDetails = await login(emailCheck, passwordCheck);
      if (loginDetails._id) {
        req.session.user = {
          id: loginDetails._id,
          firstName: loginDetails.firstName,
          lastName: loginDetails.lastName,
          role: loginDetails.role,
        };
        if (loginDetails.role === "user") {
          req.session.save(() => {
            return res.redirect("/user");
          });
        } else if (loginDetails.role === "admin") {
          req.session.save(() => {
            return res.redirect("/admin");
          });
        }
      }
    } catch (e) {
      res
        .status(400)
        .render("../views/login", { error: e.error, title: "Login" });
    }
  });

router
  .route("/register")
  .get(async (req, res) => {
    return res.render("../views/register", { title: "Register" });
  })
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
  .post(async (req, res) => {
    let registerDetails = req.body;
    let {
      firstNameInput,
      lastNameInput,
      email,
      phone,
      password,
      cpassword,
      streetAddress,
      city,
      state,
      zipCode,
    } = registerDetails;
    if (password !== cpassword) {
      res.status(400).render("../views/register", {
        error: "Passwords doesn't match",
        title: "Register",
      });
    }
    try {
      // await help.checkIfExistsForRegister(
      //   firstNameInput,
      //   lastNameInput,
      //   email,
      //   phonePrefix,
      //   phone,
      //   password,
      //   cpassword
      // );
      const firstNameErr = {
        empty: "First name  cannot be Empty",
        invalid: "First name is invalid",
      };
      const lastNameErr = {
        empty: "Last name cannot be Empty",
        invalid: "Last name is invalid",
      };

      await help.validateString(firstNameInput);
      const sanitizedFirstName = xss(firstNameInput);
      await help.validateString(lastNameInput);
      const sanitizedLastName = xss(lastNameInput);
      const emailAddress = await help.validateEmail(email);
      const sanitizedEmailAddress = xss(emailAddress);
      const userPassword = await help.validatePassword(password);
      const sanitizedUserPassword = xss(userPassword);
      const phoneNumber = await help.validatePhoneNumber(phone);
      const sanitizedPhoneNumber = xss(phoneNumber);
      const confirmPwd = await help.validatePassword(cpassword);
      const sanitizedConfirmPwd = xss(confirmPwd);
      if (sanitizedUserPassword !== sanitizedConfirmPwd) {
        throw { code: 400, error: `Password and Confirm password don't match` };
      }

      const sanitizedStreetAddress = xss(streetAddress);
      const sanitizedCity = xss(city);
      const sanitizedState = xss(state);
      const sanitizedZipCode = xss(zipCode);

      const result = await register(
        sanitizedFirstName,
        sanitizedLastName,
        sanitizedEmailAddress,
        sanitizedPhoneNumber,
        sanitizedUserPassword,
        sanitizedStreetAddress,
        sanitizedCity,
        sanitizedState,
        sanitizedZipCode
      );
      if (result._id) {
        return res.redirect("/login");
      }

      return res.status(500).json({ error: `Internal Server Error` });
    } catch (e) {
      res
        .status(400)
        .render("../views/register", { error: e.error, title: "Register" });
      //return res.status(400).json({error:e.error});
    }
  });

router
  .route("/reset")
  .get(async (req, res) => {
    /*if(req.session.user){
      return res.redirect(req.session.user.role === 'admin'?'/admin':'/protected');
    }*/
    return res.render("../views/resetPassword", { title: "Reset Password" });
  })
  .post(async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    try {
      await help.checkIfExistsForReset(email, password, confirmPassword);
      const emailAddress = await help.validateEmail(email);
      const sanitizeEmailAddress = xss(emailAddress);
      const userPassword = await help.validatePassword(password);
      const sanitizeUserPassword = xss(userPassword);
      const confirmPasswd = await help.validatePassword(confirmPassword);
      const sanitizeConfirmPasswd = xss(confirmPasswd);
      if (sanitizeUserPassword !== sanitizeConfirmPasswd) {
        throw { code: 400, error: `Password and Confirm password don't match` };
      }
      const loginDetails = await help.resetPassword(
        sanitizeEmailAddress,
        sanitizeUserPassword
      );
      if (loginDetails.updated) {
        return res.render("../views/resetPassword", {
          title: "Reset Password",
          successMessage: "Password updated successfully !",
        });
      } else {
        res.status(500).render("../views/resetPassword", {
          error: `Internal Server Error`,
          title: "Reset Password",
        });
      }
    } catch (e) {
      res.status(400).render("../views/resetPassword", {
        error: e.error,
        title: "Reset Password",
      });
    }
  });

router.route("/logout").get(async (req, res) => {
  req.session.destroy(() => {
    res.render("../views/logout", {
      title: "Logout Page",
      isLoginPage: false,
      message: "You have been successfully logged out.",
      homeLink: "/",
    });
  });
  res.clearCookie("AuthState");
});

export default router;
