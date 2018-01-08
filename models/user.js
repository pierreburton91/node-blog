const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const saltRounds = 10;

// define the schema for our user model
const userSchema = mongoose.Schema({

    account: {
        username: String,
        password: String
    },
    about: {
        firstname: String,
        lastname: String,
        picture: String,
        email: String,
        description: String,
        social: {
            facebook: String,
            twitter: String,
            google: String,
            instagram: String,
            pinterest: String,
            youtube: String,
            vimeo: String,
            medium: String,
            github: String,
            dribbble: String,
            behance: String
        }
    },
    blog: {
        name: String,
        url: String,
        logo: String,
        catchphrase: String,
        categories: [String],
        social: {
            facebook: String,
            twitter: String,
            google: String,
            instagram: String,
            pinterest: String,
            youtube: String,
            vimeo: String,
            medium: String,
            github: String,
            dribbble: String,
            behance: String
        }
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, saltRounds);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.account.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);