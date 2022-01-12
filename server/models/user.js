const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

//Define our model
const userSchema = new Schema({
  //mongo does not check for case-sensitivity, thus convert everything to lowercase
  email: { type: String, unique: true, lowercase: true },
  password: String,
});

//On Save Hook, encrypt password
//before saving a model, run this funciton (run this function pre-save)
//hook that runs before the user ever gets saved
userSchema.pre("save", function (next) {
  //context of the function is the user model.  this is giving us access to the user model
  //makes user an instance of the user model
  const user = this;

  //generate a salt, takes some small amount of time to do so, we pass a callback function that genSalt should run after the salt has been created
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }

    //salt has been created
    //hash (encrypt) our password using the salt
    //takes some amount of time to run, execute callback once its done, callback returns our hash, or encrypted password
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err);
      }

      //overwrite plain text password with encrypted password
      user.password = hash;
      //next says go ahead and save the model
      next();
    });
  });
});

//adding instance method called comparePassword
//function that is going to take a candidatePassword(submitted password by user) and a callback
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  //this is a reference to our user model, so this.password is our hashed and salted password
  //bcrypt internally do the hashing process on the candidatePassword and then decide if they are equal
  //if they are equal, isMatch = true
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
};

//Create the model class,
//tells mongoose theres a new schema about a user, and it corresponds to a collection named 'user'
const ModelClass = mongoose.model("user", userSchema);
//ModelClass represents all users, not a single user, but a class of users

//Export the model
module.exports = ModelClass;
