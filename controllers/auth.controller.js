const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      name: '',
      rollno: '',
      username: '',
      password: '',
    };
  }

  res.render('../views/signup', { inputData: sessionData });
}

async function signup(req, res, next) {
  const enteredData = {
    name: req.body.name,
    rollno: req.body.rollNo,
    username:req.body.username,
    password: req.body.password,
  };
  console.log("Auth.controller",req.body);

  if (
    !validation.userDetailsAreValid(
      req.body.name,
      req.body.rollNo,
      req.body.username,
      req.body.password,
    )  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          'Please check your input. Password must be at least 6 character slong, rollno must contain /',
        ...enteredData,
      },
      function () {
        res.redirect('/signup');
      }
    );
    return;
  }

  const user = new User(
    req.body.name,
    req.body.rollNo,
    req.body.username,
    req.body.password,
  );

  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: 'User exists already! Try logging in instead!',
          ...enteredData,
        },
        function () {
          res.redirect('/signup');
        }
      );
      return;
    }

    await user.signup();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/login');
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: '',
      password: '',
    };
  }

  res.render('../views/login', { inputData: sessionData });
}

async function login(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  let existingUser;
  try {
    existingUser = await User.getUserWithSameUsername(username);
    console.log("auth controller",existingUser);
  } catch (error) {
    next(error);
    return;
  }

  const sessionErrorData = {
    errorMessage: 'Invalid credentials - please double-check your username and password!',
    username: username,
    password: password,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect('/login');
    });
    return;
  }

  const passwordIsCorrect = await User.hasMatchingPassword(password, existingUser.password);

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect('/login');
    });
    return;
  }

  await new Promise((resolve, reject) => {
    authUtil.createUserSession(req, existingUser, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  if (existingUser.isAdmin) {
    res.redirect('/');
  } else {
    res.redirect('/student');
  }
}


function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect('/login');
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
