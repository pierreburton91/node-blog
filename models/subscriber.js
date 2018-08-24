const mongoose = require('mongoose');

// define the schema for our user model
const subscriberSchema = mongoose.Schema({

        relatedUserId: String,
        email: String,
        firstName: String,
        lastName: String,
        dateRegistred: String    

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Subscriber', subscriberSchema);