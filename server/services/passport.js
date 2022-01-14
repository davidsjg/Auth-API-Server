//where we put logic to help set up passport
//passport is what will help us authenticate a user when they attempt to visit a route that requires authentication

const passport = require("passport");
const User = require("../models/user.js");
//config for our client secret
const config = require("../config.js");

//passport jwt library
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

//passport local strategy plugin
const LocalStrategy = require("passport-local");

//Create local strategy
//local (local database or data stored locally) strategy to try and authenticate a user via email and password
//first arg is options specifically telling local strategy exactly where to look in teh request to get access to email
//LocalStrategy expects to be passed a username and a password
//were not using usernames, we're using emails.  password is found automatically....
const localOptions = { usernameField: "email" };
const localLogin = new LocalStrategy(localOptions, function (
  email,
  password,
  done //after the LocalStrategy parses the request, pulls out the email and the password, and gives it to us in below callback
) {
  //verify this email and password, call done with the user if it is the correct email and password
  //otherwise, call done with false

  //need to find user and compare passwords -> find existing user then compare the passwords
  User.findOne({ email: email }, function (err, user) {
    if (err) {
      return done(err);
    }
    //case if user is not found.  user thinks they have an account but they really don't
    if (!user) {
      return done(null, false);
    }

    //compare passowrds - is 'password' = user.password
    //however, when we stored our user, we salted and hashed the password, cant just do string comparison
    //need to decode encrytped password via bcrypt
    //when we want to sign in, need to retrieve salt + hashed password stored in database
    //take the salt(encryption key of sorts) and encrypt password user entered to login
    //this is going to create a new hashed password
    //compare stored hashed password with the new hashed password
    //never actually decript hashed password once it's encrypted
    //rather, encrypt hashed passwords and compare the two in their hashed state

    //user is from database, password is submitted password
    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        return done(err);
      }
      //no error in this case so null, but false because we did not find a user
      if (!isMatch) {
        return done(null, false);
      }
      // the final done callback assigns that user to req.user
      return done(null, user);
    });
  });
});

//why we need passport
//need to have some authentication layer that our requests are going to hit before they go to our protected routes/controllers
//passport makes this happen
//verifies if user is logged in or not before they hit protected controllers
//centralize this logic, make sure it only happens in one place, as opposed to checking for it all the time inside of our controllers themselves

//passport is an 'ecostytem' formed by what we refer to as 'strategies'
//in passport, a strategy is a method for authenticating a user
//lots of strategies (with JWT, with username and password, with google login, with facebook login, etc)
//we are using JWT

//3 step process

//create options to configure this strategy
//jwt token can sit anywhere on the request (in the body, in the URL, on the headers of the request)
//need to specifically tell this strategy where to look on request to find this key
const jwtOptions = {
  //to tell it where to look:
  //telling JWT strategy that whenever a request comes in, and we want passport to handle it, it needs to look at the requests header, and specifically a header called authorization to find the token
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  //when we create payload, we encode it with secret
  //have to tell JWT strategy the secret it should use to decode this token
  secretOrKey: config.secret,
};

//create jwt strategy (strategies are plugins of sorts that work with passport)
//create JWT login object, which is a new JWT strategy
//first argument to constructor is jwtOptions, second is a function that is called whenever a user tries to login with a JWT, or whever we need to authenticate a user, or whenever we need to authenticate a user with a JWT token
//payload is the decoded JWT token that comes from authentication.js -> object created with sub and iat is the tokens payload
//done is a callback function that we need to call dependent on whether or not we are successfully able to authenticate this user
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  //see if the user ID in the payload exists in the database
  //if it does, call 'done' with that user object
  //otherwise, call done without a user object
  //so if we succesfully find a user with the ID that we're getting from the token, we're going to pass it to this done callback
  //if we cannot find a user with that ID, we call the done function, which says no this user is not authenticated, don't let them in
  User.findById(payload.sub, function (err, user) {
    //err populated only if search fails
    if (err) {
      //second arugment should be our user object, if we found one.  we did not, so false
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      //did a search, couldn't find a user
      done(null, false);
    }
  });
});

//tell passport to use JWT strategy
passport.use(jwtLogin);

//tell passport to use local strategy
passport.use(localLogin);
