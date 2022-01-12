//how router works:
//export a function from this file, import it into index.js, then pass app into the function
const authentication = require("./controllers/authentication.js");

const passportService = require("./services/passport.js");
const passport = require("passport");

//create an object to insert into route between incoming request and route handler
//middleware, intercepter of sorts
//for any particular route we want to require authentication for, we'll use this requireAuth helper
const requireAuth = passport.authenticate("jwt", { session: false });

//create another helper like above that intercepts the request ahead of time
const requireSignin = passport.authenticate("local", { session: false });

module.exports = function (app) {
  //call a function called get, get maps directly up to the type of HTTP request that will be issued and we want to handle
  //if a get reqest comes in to '/', run the callback function
  //req = request, represents the incoming HTTP request, contains data about the actual request
  //res = response, we form up a response and send it back via res
  //next is for error handling
  //   app.get("/", function (req, res, next) {
  //     res.send(["water", "fire", "earth", "magnets"]);
  //   });

  //route handler for our signup route
  //user is posting username and password from front end
  app.post("/signup", authentication.signup);

  app.post("/signin", requireSignin, authentication.signin);

  app.get("/", requireAuth, function (req, res) {
    res.send({ hi: "there" });
  });
};
