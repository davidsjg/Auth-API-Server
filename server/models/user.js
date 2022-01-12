const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Define our model
const userSchema = new Schema({
  //mongo does not check for case-sensitivity, thus convert everything to lowercase
  email: { type: String, unique: true, lowercase: true },
});

//Create the model class,
//tells mongoose theres a new schema about a user, and it corresponds to a collection named 'user'
const ModelClass = mongoose.model("user", userSchema);
//ModelClass represents all users, not a single user, but a class of users

//Export the model
module.exports = ModelClass;
