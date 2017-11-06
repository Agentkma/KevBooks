const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  favoriteBook: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});
// authenticate login credentials against database documents
UserSchema.statics.authenticate = function (email, password, callback){
    //query to find email given
    User.findOne({email:email})
        .exec(function(error,user){
            if (error) {
                return callback(error);
            }
            else if ( !user) {
                let error = new Error ('User not found.');
                error.status = 401;
                return callback(error);
            }
            // user bcrypt compare method to comaper password used to login with hashd version on database
            bcrypt.compare(password, user.password, function (error, result){
                if (result === true){
                    // pass null in lieu of error because result is true
                    return callback(null, user);
                }
                else {return callback();
                }
            });
        })
}

// hash password before saving to database
UserSchema.pre('save', function (next){
    var user = this;

    bcrypt.hash(user.password, 10, function (error, hash){
        if (error){
            next(error);
        }
        else {
            user.password =hash;
            next();
        }
    });


});



const User = mongoose.model('User', UserSchema);
module.exports = User;
