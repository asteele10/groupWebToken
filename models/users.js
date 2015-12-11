/**
 * Created by AASteele on 12/11/15.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String, required: true, index: {unique: true}}, // username has to be unique to each user
    password: {type: String, required: true}
});

UserSchema.pre('save', function (next) { // before any save, do this function
    var user = this;
    console.log('saving user!');
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    //generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if(err) return next(err);
        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the clear-text password with the hashed one
            user.password = hash;
            next();
        });

    });
});