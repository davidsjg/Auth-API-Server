//main starting point of application
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const router = require("./router.js");

//create an instance of express, which is 'app'
const app = express();

//App Setup - all about getting express to work the way we want it to
//morgan and bodyParser are middleware for express - any incoming request to server will be passed into it first
// .use registers them as middleware

//morgan is a logging framework - used for debugging, logs requests made to server such as GET
app.use(morgan("combined"));

//bodyParser is used to parse incoming requests, specifically parsing to JSON
//attempt to do so, no matter what the request type is.  any requests that is incoming is going to be parsed as though it were JSON
app.use(bodyParser.json({ type: "*/*" }));

router(app);

//Server Setup - getting express application to talk to outside world
//if there is an environment variable of PORT already defined, use that.  Otherwise, port 3000
const port = process.env.PORT || 3090;

//http is a native node libarary, library for working very low-level with http requests that are incoming
//this says create an http server that knows how to receive requests, and anything that comes in, forward to our express application
const server = http.createServer(app);

server.listen(port);

console.log("Server listening on ", port);
