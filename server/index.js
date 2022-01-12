//main starting point of application
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");

//create an instance of express, which is 'app'
const app = express();

//App Setup - all about getting express to work the way we want it to

//Server Setup - getting express application to talk to outside world
//if there is an environment variable of PORT already defined, use that.  Otherwise, port 3000
const port = process.env.PORT || 3000;

//http is a native node libarary, library for working very low-level with http requests that are incoming
//this says create an http server that knows how to receive requests, and anything that comes in, forward to our express application
const server = http.createServer(app);

server.listen(port);

console.log("Server listening on ", port);
