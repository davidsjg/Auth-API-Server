//this is where put logic to run or process a request
//bring in request object and response object, add some logic, then respond to request
//we dont implement creating a token from scratch, we use an existing library called JWT Simple
const { json } = require("body-parser");
const jwt = require("jwt-simple");
//import config object created
const config = require("../config.js");

const User = require("../models/user.js");

//make a function that is going to take a users ID and code it with our secret
//only argument to this is a user model
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  //first arg is info we want to encode, second is secret we use to encrypt it
  //sub - JWTs have a sub property, short for subject.  who does this token belong to
  //subject of this token is this specific user (user.id)
  //iat = issued at time
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signup = function (req, res, next) {
  const emailReq = req.body.email;
  const passwordReq = req.body.password;

  //make sure both email and password are submitted from the front end
  if (!emailReq || !passwordReq) {
    return res
      .status(422)
      .send({ error: "you must provide email and password" });
  }

  // see if a user with the given email exists
  //if they dont exist, existingUser will be null
  User.findOne({ email: emailReq }, function (err, existingUser) {
    //handles case in which connectionn to database failed
    if (err) {
      return next(err);
    }

    //if a user with email does exist, return an error
    if (existingUser) {
      //.status is going to set the HTTP code on the response - 422 is unprocessable entity (data you supplied was bad)
      return res.status(422).send({ error: "Email is in use" });
    }

    //if a user with email does NOT exist, create new instance of our user Model
    //this just creates the new user in memory, does not save to database
    const user = new User({
      email: emailReq,
      password: passwordReq,
    });

    //saves user to database
    //if we want to know when the user is saved, we have to provide a callback
    user.save(function (err) {
      if (err) {
        return next(err);
      }
      //need to send back a token that the user can store and use in the future to make authenticated requests
      res.json({ token: tokenForUser(user) });
    });

    //Respond to request indicating the user was created
  });
};

//we have middleware in place to keep users out of singin route if they have not supplied correct email and password
exports.signin = function (req, res, next) {
  //user has already had email and password authed, we just need to give them a token
  //need to get access to the current user model inside of this function
  //in our passport file, when we set up our local strategy, the final done callback assigns that user to req.user
  res.send({ token: tokenForUser(req.user) });
};

//whenever we store a password, we always want to store an encrypted password
//bcrypt is popular library for encrypting passwords before they are saved
