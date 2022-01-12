//this is where put logic to run or process a request
//bring in request object and response object, add some logic, then respond to request

const User = require("../models/user.js");

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
      res.json({ success: true });
    });

    //Respond to request indicating the user was created
  });
};

//whenever we store a password, we always want to store an encrypted password
//bcrypt is popular library for encrypting passwords before they are saved
