//how router works:
//export a function from this file, import it into index.js, then pass app into the function
module.exports = function (app) {
  //call a function called get, get maps directly up to the type of HTTP request that will be issued and we want to handle
  //if a get reqest comes in to '/', run the callback function
  //req = request, represents the incoming HTTP request, contains data about the actual request
  //res = response, we form up a response and send it back via res
  //next is for error handling
  app.get("/", function (req, res, next) {
    res.send(["water", "fire", "earth", "magnets"]);
  });
};
